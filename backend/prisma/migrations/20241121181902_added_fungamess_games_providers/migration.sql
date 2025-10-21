-- CreateEnum
CREATE TYPE "FungamessGameDevice" AS ENUM ('mobile', 'desktop', 'all devices');

-- CreateTable
CREATE TABLE "fungamess_games" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,
    "demo" BOOLEAN NOT NULL,
    "typeId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "bonus_buy" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "img_vertical" TEXT NOT NULL,
    "img_provider" TEXT NOT NULL,
    "game_background" TEXT NOT NULL,
    "basicRTP" DOUBLE PRECISION NOT NULL,
    "lowRTP" DOUBLE PRECISION,
    "device" "FungamessGameDevice" NOT NULL,

    CONSTRAINT "fungamess_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fungamess_providers" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "category" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "provider_name" TEXT NOT NULL,

    CONSTRAINT "fungamess_providers_pkey" PRIMARY KEY ("id")
);
