-- CreateTable
CREATE TABLE "nft_winner_airdrop" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "roleName" TEXT NOT NULL,
    "solanaAddress" TEXT NOT NULL,
    "discord" TEXT NOT NULL,
    "airdroped" BOOLEAN NOT NULL DEFAULT false,
    "airdropTransaction" TEXT,
    "submittedDate" TIMESTAMPTZ(3),
    "airdropTime" TIMESTAMPTZ(3),
    "note" TEXT,

    CONSTRAINT "nft_winner_airdrop_pkey" PRIMARY KEY ("id")
);
