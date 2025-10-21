-- CreateTable
CREATE TABLE "nft_burn_transactions" (
    "id" SERIAL NOT NULL,
    "polygonWallet" TEXT NOT NULL,
    "burnAddress" TEXT NOT NULL,
    "tokenIds" INTEGER[],
    "solanaAddress" TEXT NOT NULL,
    "airdroped" BOOLEAN NOT NULL,
    "airdropTransaction" TEXT NOT NULL,
    "airdropTime" TIMESTAMPTZ(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "nft_burn_transactions_pkey" PRIMARY KEY ("id")
);
