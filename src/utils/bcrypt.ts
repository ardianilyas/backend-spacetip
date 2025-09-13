import bcrypt from 'bcrypt';
export const SALT_ROUNDS = 10;

export function hashString(s: string) {
    return bcrypt.hash(s, SALT_ROUNDS);
}

export function compareHash(s: string, hash: string) {
    return bcrypt.compare(s, hash);
}