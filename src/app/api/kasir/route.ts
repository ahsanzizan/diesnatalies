import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const queryParams = req.nextUrl.searchParams;
  const id = Number(queryParams?.get('id'));

  try {
    if (!id) {
      const kasirs = await prisma.kasir.findMany();
      return NextResponse.json({ message: "success", kasirs }, { status: 200 });
    }

    const getKasirWithId = await prisma.kasir.findUnique({ where: { id } });
    return NextResponse.json({ message: "success", kasir: getKasirWithId });

  } catch {
    return NextResponse.json({ status: 500, message: 'internal server error' });
  }
};

export const POST = async (req: Request) => {
  try {
    const data = await req.formData();
    const email: string = data.get("email") as string;
    const nama: string = data.get("nama") as string;
    const noHp: string = data.get("noHp") as string;
    const password: string = data.get("password") as string;

    await prisma.kasir.create({ data: { email, nama, noHp, password } });

    return NextResponse.json({ status: 200, message: 'sucess' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 500, message: 'internal server error' });
  }
}

export const PATCH = async (req: NextRequest) => {
  const queryParams = req.nextUrl.searchParams;
  const id = Number(queryParams?.get('id'));

  if (!id) {
    return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });
  }

  try {
    const data = await req.formData();
    const email: string = data.get("email") as string;
    const nama: string = data.get("nama") as string;
    const noHp: string = data.get("noHp") as string;
    const password: string = data.get("password") as string;

    await prisma.kasir.update({ where: { id }, data: { email, nama, noHp, password } });
    return NextResponse.json({ status: 200, message: 'success' });
  } catch {
    return NextResponse.json({ status: 500, message: 'internal server error' });
  }
}

export const DELETE = async (req: NextRequest) => {
  const queryParams = req.nextUrl.searchParams;
  const id = Number(queryParams?.get("id"));

  if (!id) {
    return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });
  }

  try {
    await prisma.kasir.delete({ where: { id } });
    return NextResponse.json({ status: 200, message: 'success' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 500, message: 'internal server error' });
  }
}