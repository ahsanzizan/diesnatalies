/*
  Warnings:

  - A unique constraint covering the columns `[nomorPesanan]` on the table `Transaksi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Transaksi_nomorPesanan_key` ON `Transaksi`(`nomorPesanan`);
