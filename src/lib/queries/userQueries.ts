import { validatePassword } from "../passwordHash";
import { prisma } from "../prisma";
import { User } from "@prisma/client";

export async function getAllUsers() {
    const results = await prisma.user.findMany({ include: { transaksis: true } });
    return results;
}

export async function findUserByUname(username: string) {
    const result = await prisma.user.findUnique({ where: { username }, include: { transaksis: true } });
    return result;
}

type loginAuth = {
    status: "SUCCESS" | "NO_PASSWORD" | "INVALID";
    user?: User;
}

export async function loginAuth(username: string, password: string): Promise<loginAuth> {
    const findUser = await findUserByUname(username);

    let result: loginAuth = {
        status: "INVALID",
        user: undefined
    }

    if (findUser) {
        if (!findUser) {
            result.status = "NO_PASSWORD";
        } else {
            const validate = await validatePassword(password, findUser.password);
            if (validate) {
                result.status = "SUCCESS";
                result.user = findUser;
            }
        }
    } else {
        result.status = "INVALID";
    }

    return result;
}

export async function deleteUser(id: number) {
    const users = await prisma.user.findMany({ include: { transaksis: true } });
    const findUser = users.find(user => user.id === id);
    let res = null;

    if (findUser) {
        res = await prisma.user.delete({ where: { id } });
    }

    return res;
}