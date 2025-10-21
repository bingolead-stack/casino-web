-- CreateTable
CREATE TABLE "failed_transactions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "tokenAmount" DOUBLE PRECISION NOT NULL,
    "txHash" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(3),

    CONSTRAINT "failed_transactions_pkey" PRIMARY KEY ("id")
);
