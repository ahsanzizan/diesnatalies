/*
  Warnings:

  - You are about to drop the column `idKasir` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kasir` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nomorStand]` on the table `Stand` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idUser` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_idKasir_fkey`;

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `idKasir`,
    ADD COLUMN `idUser` INTEGER NOT NULL;

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `kasir`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'KASIR') NOT NULL DEFAULT 'KASIR',

    UNIQUE INDEX `User_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Stand_nomorStand_key` ON `Stand`(`nomorStand`);

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
