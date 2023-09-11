import { authOptions } from "@/lib/auth";
import { hashPassword } from "@/lib/passwordHash";
import { prisma } from "@/lib/prisma";
import { deleteUser, findUserByEmail, getAllUsers } from "@/lib/queries/userQueries";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const queryParams = req.nextUrl.searchParams;
    const email = queryParams?.get('email');

    try {
        if (!email) {
            const users = await getAllUsers();
            return NextResponse.json({ message: "success", users }, { status: 200 });
        }

        const getUserWithEmail = await findUserByEmail(email);
        return NextResponse.json({ message: "success", user: getUserWithEmail }, { status: 200 });
    } catch {
        return NextResponse.json({ status: 500, message: 'internal server error' });
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const queryParams = req.nextUrl.searchParams;
    const id = Number(queryParams?.get('id'));

    if (session?.user?.role != "ADMIN") {
        return NextResponse.json({ status: 403, message: 'forbidden' }, { status: 403 });
    }

    try {
        const data = await req.formData();
        const username = data.get('username') as string;
        const noHp = data.get('noHp') as string;
        const password = hashPassword(data.get('password') as string);
        const email = data.get('email') as string;

        await prisma.user.update({ where: { id }, data: { username, noHp, email, password } });
        return NextResponse.json({ message: "success" }, { status: 200 });

    } catch {
        return NextResponse.json({ status: 500, message: "internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role != "ADMIN") {
        return NextResponse.json({ status: 403, message: 'forbidden' }, { status: 403 });
    }

    try {
        const data = await req.formData();
        const username = data.get('username') as string;
        const noHp = data.get('noHp') as string;
        const password = hashPassword(data.get('password') as string);
        const email = data.get('email') as string;

        await prisma.user.create({ data: { username, email, noHp, password } });
        return NextResponse.json({ status: 200, message: 'success' }, { status: 200 });
    } catch {
        return NextResponse.json({ status: 500, message: "internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const queryParams = req.nextUrl.searchParams;
    const id = Number(queryParams?.get('id'));

    if (!id) return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });

    try {
        await deleteUser(id);
        return NextResponse.json({ status: 200, message: "success" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 500, message: 'internal server error' });
    }
}