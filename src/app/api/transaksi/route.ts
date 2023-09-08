import { prisma } from "@/lib/prisma";
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
    try {
        const data = await req.formData();
        const idKasir = 1; // Get from session
        const nomorPesanan = data.get('nomorPesanan') as string;
        const totalPesanan = Number(data.get('totalPesanan') as string);
        const idStand = Number(data.get('idStand') as string);

        await prisma.transaksi.create({ data: { nomorPesanan, totalPesanan, idKasir, idStand } });

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
        const idKasir = 1; // Get from session
        const nomorPesanan = data.get('nomorPesanan') as string;
        const totalPesanan = Number(data.get('totalPesanan') as string);
        const idStand = Number(data.get('idStand') as string);

        await prisma.transaksi.update({ where: { id }, data: { idKasir, nomorPesanan, totalPesanan, idStand } });
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
        await prisma.transaksi.delete({ where: { id } });
        return NextResponse.json({ status: 200, message: 'success' }, { status: 200 });
    } catch {
        return NextResponse.json({ status: 500, message: 'internal server error' });
    }
}