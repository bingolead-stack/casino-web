/*
  Warnings:

  - You are about to drop the column `tokenIds` on the `nft_burn_transactions` table. All the data in the column will be lost.
  - Added the required column `tokenId` to the `nft_burn_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nft_burn_transactions" DROP COLUMN "tokenIds",
ADD COLUMN     "tokenId" INTEGER NOT NULL;
