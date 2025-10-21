-- DropForeignKey
ALTER TABLE "custom_game_categories" DROP CONSTRAINT "custom_game_categories_gameId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_games" DROP CONSTRAINT "favorite_games_gameId_fkey";

-- DropForeignKey
ALTER TABLE "recent_games" DROP CONSTRAINT "recent_games_gameId_fkey";

-- AlterTable
ALTER TABLE "custom_game_categories" ALTER COLUMN "gameId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "favorite_games" ALTER COLUMN "gameId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "recent_games" ALTER COLUMN "gameId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "gameId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user_activities" ALTER COLUMN "gameId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "custom_game_categories" ADD CONSTRAINT "custom_game_categories_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "gr8_games"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_games" ADD CONSTRAINT "favorite_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "gr8_games"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_games" ADD CONSTRAINT "recent_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "gr8_games"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;
