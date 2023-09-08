import { hashPassword, validatePassword } from "../passwordHash";
import { prisma } from "../prisma";
import { User } from "@prisma/client";

export async function getAllUsers(): Promise<User[] | null> {
    const results = await prisma.user.findMany();
    return results;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const result = await prisma.user.findUnique({ where: { email } });
    return result;
}

type loginAuth = {
    status: "SUCCESS" | "NO_PASSWORD" | "INVALID";
    user?: User;
}

export async function loginAuth(email: string, password: string): Promise<loginAuth> {
    const findUser = await findUserByEmail(email);
    const hashedPassword = hashPassword(password);

    let result: loginAuth = {
        status: "INVALID",
        user: undefined
    }

    if (findUser) {
        if (!findUser) {
            result.status = "NO_PASSWORD";
        } else {
            const validate = await validatePassword(password, hashedPassword);
            if (!validate) {
                result.status = "SUCCESS";
                result.user = findUser;
            }
        }
    } else {
        result.status = "INVALID";
    }

    return result;
}