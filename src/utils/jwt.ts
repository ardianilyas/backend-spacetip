import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AccessPayload = { userId: string, role: string };
export type RefreshPayload = { userId: string, tokenId: string, jti: string };

const SECRET = env.JWT_SECRET as string;

export function signAccessToken(payload: AccessPayload) {
    return jwt.sign(payload, SECRET, { expiresIn: 15 * 60 });
}

export function verifyAccessToken(token: string): AccessPayload {
    return jwt.verify(token, SECRET) as AccessPayload;
}

export function signRefreshToken(payload: RefreshPayload) {
    return jwt.sign(payload, SECRET, { expiresIn: 7 * 24 * 60 * 60 });
}

export function verifyRefreshToken(token: string): RefreshPayload {
    return jwt.verify(token, SECRET) as RefreshPayload;
}