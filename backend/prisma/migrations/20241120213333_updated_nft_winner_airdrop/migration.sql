/*
  Warnings:

  - You are about to drop the column `discord` on the `nft_winner_airdrop` table. All the data in the column will be lost.
  - Added the required column `discordId` to the `nft_winner_airdrop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordName` to the `nft_winner_airdrop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nft_winner_airdrop" DROP COLUMN "discord",
ADD COLUMN     "discordId" TEXT NOT NULL,
ADD COLUMN     "discordName" TEXT NOT NULL;
