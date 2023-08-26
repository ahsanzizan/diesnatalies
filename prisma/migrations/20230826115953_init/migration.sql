/*
  Warnings:

  - You are about to drop the column `email` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `noHp` on the `admin` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Admin_email_key` ON `admin`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `email`,
    DROP COLUMN `noHp`;
