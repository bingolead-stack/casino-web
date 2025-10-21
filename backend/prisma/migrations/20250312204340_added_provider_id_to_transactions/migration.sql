-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "providerId" INTEGER;

-- CreateIndex
CREATE INDEX "transactions_txHash_idx" ON "transactions"("txHash");
