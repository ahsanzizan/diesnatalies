import bcrypt from "bcrypt";

export function validatePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}
export function hashPassword(text: string) {
    const hash = bcrypt.hashSync(text, 12);

    return hash;
}
