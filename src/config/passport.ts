import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { prisma } from "./prisma";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { hashString } from "../utils/bcrypt";
import msFromExpiryString from "../utils/msFromExpiryString";
import { env } from "./env";

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
                if(!user) {
                    user = await prisma.user.create({
                        data: {
                            googleId: profile.id,
                            email: profile.emails?.[0].value!,
                            name: profile.displayName,
                        }
                    });
                }

                const access = signAccessToken({ userId: user.id, role: user.role });

                const tokenId = uuidv4();
                const jti = crypto.randomBytes(64).toString("hex");
                const refresh = signRefreshToken({ userId: user.id, tokenId, jti });

                const hashedToken = await hashString(jti);
                const expiresAt = new Date(Date.now() + msFromExpiryString(env.JWT_REFRESH_EXPIRES));

                await prisma.refreshToken.create({
                    data: {
                        id: tokenId,
                        tokenHash: hashedToken,
                        userId: user.id,
                        expiresAt,
                    }
                })

                done(null, { user, access, refresh });
            } catch (error) {
                done(error, undefined);
            }
        }
    )
)