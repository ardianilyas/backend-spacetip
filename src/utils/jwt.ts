import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AccessPayload = { userId: string, role: string };
export type RefreshPayload = { userId: string, tokenId: string, jti: string };

const SECRET = env.JWT_SECRET!;

export function signAccessToken(payload: AccessPayload) {
    return jwt.sign(payload, SECRET, { expiresIn: Number(env.JWT_ACCESS_EXPIRES) });
}

export function verifyAccessToken(token: string): AccessPayload {
    return jwt.verify(token, SECRET) as AccessPayload;
}

export function signRefreshToken(payload: RefreshPayload) {
    return jwt.sign(payload, SECRET, { expiresIn: Number(env.JWT_REFRESH_EXPIRES) });
}

export function verifyRefreshToken(token: string): RefreshPayload {
    return jwt.verify(token, SECRET) as RefreshPayload;
}