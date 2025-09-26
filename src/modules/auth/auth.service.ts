import crypto from 'crypto';
import { RefreshTokenRepository } from './refreshToken.repository.js';
import { compareHash, hashString } from '../../utils/bcrypt.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env.js';
import { LoginSchema, RegisterSchema } from './auth.schema.js';
import msFromExpiryString from '../../utils/msFromExpiryString.js';
import { AuthRepository } from './auth.repository.js';
import { logger } from '../../utils/logger.js';
import { ConflictError, NotFoundError, UnprocessableEntityError } from '../../utils/errors.js';

export class AuthService {
    constructor(private refreshRepo: RefreshTokenRepository, private authRepo: AuthRepository) {

    }

    async me(id: string) {
        const user = await this.authRepo.findUserById(id);
        if (!user) throw new NotFoundError("User not found");
        return user;
    }

    async register(data: RegisterSchema) {
        const hashed = await hashString(data.password);

        const exists = await this.authRepo.findUserByEmail(data.email);
        if (exists) throw new ConflictError("User already exists");

        const user = await this.authRepo.createUser({ ...data, password: hashed });
        logger.app.info({ data: user }, "A new user registered");

        return user;
    }

    async login(data: LoginSchema) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) throw new UnprocessableEntityError("This credentials doesn't match our records");

        const ok = await compareHash(data.password, user.password!);
        if(!ok) throw new UnprocessableEntityError("This credentials doesn't match our records");

        const accessToken = signAccessToken({ userId: user.id, role: user.role });

        const tokenId = uuidv4();
        const jti = crypto.randomBytes(64).toString("hex");
        const tokenHash = await hashString(jti);
        const expiresAt = new Date(Date.now() + msFromExpiryString(env.JWT_REFRESH_EXPIRES));

        await this.refreshRepo.create({
            id: tokenId,
            tokenHash,
            userId: user.id,
            expiresAt
        });

        const refreshJwt = signRefreshToken({ userId: user.id, tokenId, jti });

        return { accessToken, refreshToken: refreshJwt };
    }

    async rotateRefresh(refreshJwt: string) {
        const payload = verifyRefreshToken(refreshJwt);
        const { tokenId, userId, jti } = payload;

        const tokenRecord = await this.refreshRepo.findById(tokenId);

        if(!tokenRecord) {
            await this.refreshRepo.revokeAllForUser(userId);
            throw new Error("Refresh token reuse detected or token revoked");
        }

        if (tokenRecord.revoked) {
            await this.refreshRepo.revokeAllForUser(userId)
            throw new Error("Refresh token revoked");
        }

        const match = await compareHash(jti, tokenRecord.tokenHash);
        if(!match) {
            await this.refreshRepo.revokeAllForUser(userId);
            throw new Error("Refresh token reuse detected or token revoked");
        }

        await this.refreshRepo.deleteById(tokenId);

        const newTokenId = uuidv4();
        const newJti = crypto.randomBytes(64).toString("hex");
        const newHash = await hashString(newJti);
        const expiresAt = new Date(Date.now() + msFromExpiryString(env.JWT_REFRESH_EXPIRES));

        const newRefresh = await this.refreshRepo.create({
            id: newTokenId,
            tokenHash: newHash,
            userId,
            expiresAt,
        });
        logger.app.info({ data: newRefresh }, "A new refresh token created");

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if(!user) throw new NotFoundError("User not found");

        const newRefreshJwt = signRefreshToken({ userId, tokenId: newTokenId, jti: newJti });
        const accessToken = signAccessToken({ userId, role: user.role });

        return { accessToken, refreshToken: newRefreshJwt };
    }

    async logout(refreshJwt: string) {
        if (!refreshJwt) return;

        try {
            const payload = verifyRefreshToken(refreshJwt);
            const { tokenId, userId } = payload;
            await this.refreshRepo.deleteById(tokenId);
        } catch (error) {
            
        }
    }
}