-- CreateTable
CREATE TABLE "token_prices" (
    "id" SERIAL NOT NULL,
    "chainId" INTEGER NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "usdPrice" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "token_prices_pkey" PRIMARY KEY ("id")
);
