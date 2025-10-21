/*
  Warnings:

  - You are about to drop the column `amount` on the `agent_transactions` table. All the data in the column will be lost.
  - Added the required column `cash` to the `agent_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agent_transactions" DROP COLUMN "amount",
ADD COLUMN     "cash" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
