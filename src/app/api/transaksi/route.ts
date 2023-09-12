import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllStand } from "@/lib/queries/standQueries";
import { getAllTransaksi } from "@/lib/queries/transaksiQueries";
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
    const session = await getServerSession(authOptions);
    if (session?.user?.role != "KASIR") return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });

    try {
        const data = await req.formData();
        const idUser = Number(session?.user?.id); // Get from session
        const nomorPesanan = data.get('nomorPesanan') as string;
        const totalPesanan = Number(data.get('totalPesanan') as string);
        const nomorStand = Number(data.get('nomorStand') as string);

        // Validate nomorPesanan 
        const transaksis = await getAllTransaksi();
        if (transaksis?.find(transaksi => transaksi.nomorPesanan == nomorPesanan)) {
            return NextResponse.json({ status: 403, message: "nomorPesanan already exist" }, { status: 403 });
        }

        // Get idStand
        const stands = await getAllStand();
        const findStandWithNomor = stands?.find(stand => stand.nomorStand == nomorStand);
        if (!findStandWithNomor) {
            return NextResponse.json({ status: 403, message: "stand doesn't exist" }, { status: 403 });
        }
        const idStand = findStandWithNomor?.id as number;

        console.log({ nomorPesanan, totalPesanan, idUser, idStand });
        await prisma.transaksi.create({ data: { nomorPesanan, totalPesanan, idUser, idStand } });

        return NextResponse.json({ status: 200, message: 'success' }, { status: 200 });
    } catch {
        return NextResponse.json({ status: 500, message: 'internal server error' });
    }
}

export const PUT = async (req: NextRequest) => {
    const queryParams = req.nextUrl.searchParams;
    const id = Number(queryParams?.get('id'));

    const session = await getServerSession(authOptions);
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
        if (data.get('totalPesanan') == "") {
            return NextResponse.json({ status: 403, message: "forbidden" }, { status: 403 });
        }
        const totalPesanan = Number(data.get('totalPesanan') as string);

        await prisma.transaksi.update({ where: { id }, data: { totalPesanan } });
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