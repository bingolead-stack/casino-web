-- CreateTable
CREATE TABLE "favorite_games" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_games_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "favorite_games" ADD CONSTRAINT "favorite_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "fungamess_games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
