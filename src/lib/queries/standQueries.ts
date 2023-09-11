import { Stand } from "@prisma/client";
import { prisma } from "../prisma";

export async function getAllStand(): Promise<Stand[] | null> {
    const results = await prisma.stand.findMany();
    return results;
}

export async function getStandByNomorStand(nomorStand: number): Promise<Stand | null> {
    const result = await prisma.stand.findUnique({ where: { nomorStand } });
    return result;
}

export async function createStand(stand: Stand) {
    const result = await prisma.stand.create({ data: stand });
    return result;
}