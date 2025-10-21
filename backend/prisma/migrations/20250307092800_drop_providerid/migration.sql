/*
  Warnings:

  - The primary key for the `gr8_games` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gameId` on the `gr8_games` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `user_activities` table. All the data in the column will be lost.
  - You are about to drop the column `providerName` on the `user_activities` table. All the data in the column will be lost.
  - Added the required column `id` to the `gr8_games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDeleted` to the `gr8_games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'bet';
ALTER TYPE "TransactionType" ADD VALUE 'win';
ALTER TYPE "TransactionType" ADD VALUE 'refund';
ALTER TYPE "TransactionType" ADD VALUE 'promo_win';
ALTER TYPE "TransactionType" ADD VALUE 'tournament_win';

-- DropForeignKey
ALTER TABLE "custom_game_categories" DROP CONSTRAINT "custom_game_categories_gameId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_games" DROP CONSTRAINT "favorite_games_gameId_fkey";

-- DropForeignKey
ALTER TABLE "recent_games" DROP CONSTRAINT "recent_games_gameId_fkey";

-- AlterTable
ALTER TABLE "gr8_games" DROP CONSTRAINT "gr8_games_pkey",
DROP COLUMN "gameId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "img_custom" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL,
ADD CONSTRAINT "gr8_games_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "provider" TEXT;

-- AlterTable
ALTER TABLE "user_activities" DROP COLUMN "providerId",
DROP COLUMN "providerName",
ADD COLUMN     "provider" TEXT;

-- CreateTable
CREATE TABLE "gr8_providers" (
    "provider" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1000,
    "added_slot" BOOLEAN NOT NULL DEFAULT false,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "gr8_providers_pkey" PRIMARY KEY ("provider")
);

-- AddForeignKey
ALTER TABLE "custom_game_categories" ADD CONSTRAINT "custom_game_categories_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "gr8_games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_games" ADD CONSTRAINT "favorite_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "gr8_games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_games" ADD CONSTRAINT "recent_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "gr8_games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
