-- CreateTable
CREATE TABLE "pending_money" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pending_money_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pending_money" ADD CONSTRAINT "pending_money_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
