/*
  Warnings:

  - You are about to drop the `referral_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "referral_events";

-- CreateTable
CREATE TABLE "summarized_bets" (
    "userId" TEXT NOT NULL,
    "yearMonth" INTEGER NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "summarized_bets_pkey" PRIMARY KEY ("userId","yearMonth")
);

-- CreateTable
CREATE TABLE "summarized_bet_logs" (
    "yearMonth" INTEGER NOT NULL,

    CONSTRAINT "summarized_bet_logs_pkey" PRIMARY KEY ("yearMonth")
);
