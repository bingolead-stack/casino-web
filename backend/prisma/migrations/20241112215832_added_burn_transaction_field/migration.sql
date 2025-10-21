/*
  Warnings:

  - Added the required column `burnTransaction` to the `nft_burn_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nft_burn_transactions" ADD COLUMN     "burnTransaction" TEXT NOT NULL;
