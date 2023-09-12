import { Stand } from "@prisma/client";
import { prisma } from "../prisma";

export async function getAllStands() {
    const results = await prisma.stand.findMany({ include: { transaksis: true } });
    return results;
}

export async function getStandByNomorStand(nomorStand: number) {
    const result = await prisma.stand.findUnique({ where: { nomorStand }, include: { transaksis: true } });
    return result;
}

export async function createStand(stand: Stand) {
    const result = await prisma.stand.create({ data: stand });
    return result;
}