import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const queryParams = req.nextUrl.searchParams;
  const id = Number(queryParams?.get('id'));

  try {
    if (!id) {
      const stands = await prisma.stand.findMany();
      return NextResponse.json({ message: "success", stands }, { status: 200 });
    }

    const getStandWithId = await prisma.stand.findUnique({ where: { id } });
    return NextResponse.json({ message: "success", stand: getStandWithId });

  } catch {
    return NextResponse.json({ status: 500, message: 'internal server error' });
  }
};

export const POST = async (req: Request) => {
  const session = await getServerSession();
  if (!session?.user?.role?.includes("ADMIN")) return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });
  
  try {
    const data = await req.formData();
    const nomorStand: number = Number(data.get("nomorStand") as string);
    const pemilik: string = data.get("pemilik") as string;
    const noHp: string = data.get("noHp") as string;

    await prisma.stand.create({ data: { nomorStand, pemilik, noHp } });

    return NextResponse.json({ status: 200, message: 'sucess' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 500, message: 'internal server error' });
  }
}

export const PATCH = async (req: NextRequest) => {
  const session = await getServerSession();
  if (!session?.user?.role?.includes("ADMIN")) return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });

  const queryParams = req.nextUrl.searchParams;
  const id = Number(queryParams?.get('id'));

  if (!id) {
    return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });
  }

  try {
    const data = await req.formData();
    const nomorStand: number = Number(data.get("nomorStand") as string);
    const pemilik: string = data.get("pemilik") as string;
    const noHp: string = data.get("noHp") as string;

    await prisma.stand.create({ data: { nomorStand, pemilik, noHp } });
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
    await prisma.stand.delete({ where: { id } });
    return NextResponse.json({ status: 200, message: 'success' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 500, message: 'internal server error' });
  }
}