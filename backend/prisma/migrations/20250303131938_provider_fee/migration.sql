-- CreateTable
CREATE TABLE "provider_fees" (
    "id" INTEGER NOT NULL,
    "providerName" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "provider_fees_pkey" PRIMARY KEY ("id")
);
