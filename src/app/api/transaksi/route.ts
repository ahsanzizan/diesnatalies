import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const queryParams = req.nextUrl.searchParams;
    const id = Number(queryParams?.get('id'));

    try {
        if (!id) {
            const transaksis = await prisma.transaksi.findMany();
            return NextResponse.json({ message: "success", transaksis }, { status: 200 });
        }

        const getStandWithId = await prisma.transaksi.findUnique({ where: { id } });
        return NextResponse.json({ message: "success", stand: getStandWithId });
    } catch {
        return NextResponse.json({ status: 500, message: 'internal server error' });
    }
};

export const POST = async (req: Request) => {
    const session = await getServerSession();
    if (!session?.user?.role?.includes("KASIR")) return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });

    try {
        const data = await req.formData();
        const idUser = Number(session?.user?.id); // Get from session
        const nomorPesanan = data.get('nomorPesanan') as string;
        const totalPesanan = Number(data.get('totalPesanan') as string);
        const idStand = Number(data.get('idStand') as string);

        await prisma.transaksi.create({ data: { nomorPesanan, totalPesanan, idUser, idStand } });

        return NextResponse.json({ status: 200, message: 'sucess' }, { status: 200 });
    } catch {
        return NextResponse.json({ status: 500, message: 'internal server error' });
    }
}

export const PUT = async (req: NextRequest) => {
    const queryParams = req.nextUrl.searchParams;
    const id = Number(queryParams?.get('id'));

    const session = await getServerSession();
    if (!session?.user?.role?.includes("KASIR")) return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });

    if (!id) {
        return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });
    }

    try {
        const findOne = await prisma.transaksi.findUnique({ where: { id } });
        if (!findOne) {
            return NextResponse.json({ status: 404, message: "not found" }, { status: 404 });
        }
        
        const data = await req.formData();
        const idUser = Number(session?.user?.id); // Get idKasir from session
        const nomorPesanan = data.get('nomorPesanan') as string;
        const totalPesanan = Number(data.get('totalPesanan') as string);
        const idStand = Number(data.get('idStand') as string);

        await prisma.transaksi.update({ where: { id }, data: { idUser, nomorPesanan, totalPesanan, idStand } });
        return NextResponse.json({ status: 200, message: 'success' });
    } catch {
        return NextResponse.json({ status: 500, message: 'internal server error' });
    }
}

export const DELETE = async (req: NextRequest) => {
    const queryParams = req.nextUrl.searchParams;
    const id = Number(queryParams?.get("id"));

    const session = await getServerSession();
    if (!session?.user?.role?.includes("KASIR")) return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });

    if (!id) {
        return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });
    }

    try {
        const findOne = await prisma.transaksi.findUnique({ where: { id } });
        if (!findOne) {
            return NextResponse.json({ status: 404, message: "not found" }, { status: 404 });
        }

        await prisma.transaksi.delete({ where: { id } });
        return NextResponse.json({ status: 200, message: 'success' }, { status: 200 });

    } catch {
        return NextResponse.json({ status: 500, message: 'internal server error' });
    }
}