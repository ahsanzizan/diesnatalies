import { hashPassword } from "@/lib/passwordHash";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession();
    if (session?.user?.role != "ADMIN") {
        return NextResponse.json({ status: 403, message: 'forbidden' }, { status: 403 })
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