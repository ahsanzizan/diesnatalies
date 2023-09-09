// ONLY FOR CREATING ADMIN USER

import { hashPassword } from "@/lib/passwordHash";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const username = data.get('username') as string;
        const noHp = data.get('noHp') as string;
        const password = hashPassword(data.get('password') as string);
        const email = data.get('email') as string;

        await prisma.user.create({ data: { username, email, noHp, password, role: "ADMIN" } });
        return NextResponse.json({ status: 200, message: 'success' }, { status: 200 });
    } catch {
        return NextResponse.json({ status: 500, message: "internal server error" }, { status: 500 });
    }
}