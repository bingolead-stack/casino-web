-- CreateTable
CREATE TABLE "custom_game_categories" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "custom_game_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "custom_game_categories" ADD CONSTRAINT "custom_game_categories_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "fungamess_games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
