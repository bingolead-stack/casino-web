/*
  Warnings:

  - You are about to drop the column `cash_ltc` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "cash_ltc",
ADD COLUMN     "cash_18087" DOUBLE PRECISION NOT NULL DEFAULT 0;
