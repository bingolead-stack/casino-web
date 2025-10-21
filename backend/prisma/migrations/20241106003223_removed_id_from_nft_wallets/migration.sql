/*
  Warnings:

  - The primary key for the `nft_wallets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `nft_wallets` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "nft_wallets_polygonAddress_key";

-- AlterTable
ALTER TABLE "nft_wallets" DROP CONSTRAINT "nft_wallets_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "nft_wallets_pkey" PRIMARY KEY ("polygonAddress");
