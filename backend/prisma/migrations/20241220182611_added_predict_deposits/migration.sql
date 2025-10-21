-- CreateEnum
CREATE TYPE "PredictDepositType" AS ENUM ('visited', 'checked');

-- CreateTable
CREATE TABLE "predict_deposits" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "PredictDepositType" NOT NULL,

    CONSTRAINT "predict_deposits_pkey" PRIMARY KEY ("id")
);
