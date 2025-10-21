/*
  Warnings:

  - A unique constraint covering the columns `[polygonAddress]` on the table `nft_wallets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "nft_wallets_polygonAddress_key" ON "nft_wallets"("polygonAddress");
