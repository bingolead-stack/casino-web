/*
  Warnings:

  - You are about to drop the `nft_burn_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nft_wallets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nft_winner_airdrop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vpn_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "vpn_users" DROP CONSTRAINT "vpn_users_userId_fkey";

-- DropTable
DROP TABLE "nft_burn_transactions";

-- DropTable
DROP TABLE "nft_wallets";

-- DropTable
DROP TABLE "nft_winner_airdrop";

-- DropTable
DROP TABLE "vpn_users";
