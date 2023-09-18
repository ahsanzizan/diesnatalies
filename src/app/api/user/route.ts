import { authOptions } from "@/lib/auth";
import { hashPassword } from "@/lib/passwordHash";
import { prisma } from "@/lib/prisma";
import { deleteUser, findUserByUname, getAllUsers } from "@/lib/queries/userQueries";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const users = await getAllUsers();
        return NextResponse.json({ message: "success", users }, { status: 200 });
    } catch {
        return NextResponse.json({ status: 500, message: 'internal server error' });
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const queryParams = req.nextUrl.searchParams;
    const id = Number(queryParams?.get('id'));

    if (session?.user?.role != "ADMIN" || !id) {
        return NextResponse.json({ status: 403, message: 'forbidden' }, { status: 403 });
    }

    try {
        const data = await req.formData();
        const username = data.get('username') as string;
        const noHp = data.get('noHp') as string;
        const nama = data.get('nama') as string;
        const password = data.get('password') as string;

        // Validate username
        const getAll = await getAllUsers();
        if (getAll?.find(user => user.username == username)) {
            return NextResponse.json({ status: 403, message: "username already in use" }, { status: 403 });
        }

        if (password != "") {
            const hashedPassword = hashPassword(password);
            await prisma.user.update({ where: { id }, data: { username, noHp, nama, password: hashedPassword } });
            return NextResponse.json({ message: "success" }, { status: 200 });
        }

        await prisma.user.update({ where: { id }, data: { username, noHp, nama } });
        return NextResponse.json({ message: "success" }, { status: 200 });

    } catch (error) {
        console.log(error);
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
        const nama = data.get('nama') as string;

        // Validate username
        const getAll = await getAllUsers();
        if (getAll?.find(user => user.username == username)) {
            return NextResponse.json({ status: 403, message: "username already in use" }, { status: 403 });
        }

        await prisma.user.create({ data: { username, nama, noHp, password } });
        return NextResponse.json({ status: 200, message: 'success' }, { status: 200 });
    } catch (error) {
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