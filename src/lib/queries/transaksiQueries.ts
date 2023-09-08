import { Transaksi } from "@prisma/client";
import { prisma } from "../prisma";

export async function getTransaksiByKasir(idKasir: number): Promise<Transaksi[] | null> {
    const result = await prisma.transaksi.findMany({ where: { idUser: idKasir } });
    return result;
}

export async function getAllTransaksi(): Promise<Transaksi[] | null> {
    const results = await prisma.transaksi.findMany();
    return results;
}

export async function createTransaksi(transaksi: Transaksi) {
    const create = await prisma.transaksi.create({ data: { ...transaksi } });
    return create;
}
