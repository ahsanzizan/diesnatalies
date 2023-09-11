import { Transaksi } from "@prisma/client";
import { prisma } from "../prisma";
import { getStandByNomorStand } from "./standQueries";

export async function getTransaksiByKasir(idKasir: number): Promise<Transaksi[] | null> {
    const results = await prisma.transaksi.findMany({ where: { idUser: idKasir } });
    return results;
}

export async function getTransaksiByStand(nomorStand: number): Promise<Transaksi[] | null> {
    const idStand = await getStandByNomorStand(nomorStand).then(res => res?.id);
    const results = await prisma.transaksi.findMany({ where: { idStand } });
    return results;
}

export async function getAllTransaksi(): Promise<Transaksi[] | null> {
    const results = await prisma.transaksi.findMany();
    return results;
}

export async function createTransaksi(transaksi: Transaksi) {
    const create = await prisma.transaksi.create({ data: { ...transaksi } });
    return create;
}
