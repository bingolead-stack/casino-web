-- CreateTable
CREATE TABLE "referral_rewards" (
    "userId" TEXT NOT NULL,
    "yearMonth" INTEGER NOT NULL,
    "reward" DOUBLE PRECISION NOT NULL,
    "bFinalized" BOOLEAN NOT NULL,

    CONSTRAINT "referral_rewards_pkey" PRIMARY KEY ("userId","yearMonth")
);
