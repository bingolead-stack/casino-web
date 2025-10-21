-- CreateTable
CREATE TABLE "recent_games" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_games_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recent_games" ADD CONSTRAINT "recent_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "fungamess_games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
