-- CreateTable
CREATE TABLE "gr8_games" (
    "gameId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "translationKey" TEXT NOT NULL,
    "gameProvider" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "dealerLanguage" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isDemoModeAvailable" BOOLEAN NOT NULL,
    "isFreeSpinsAvailable" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "gr8_games_pkey" PRIMARY KEY ("gameId")
);
