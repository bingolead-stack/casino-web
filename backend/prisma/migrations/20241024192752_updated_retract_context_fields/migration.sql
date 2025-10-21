/*
  Warnings:

  - You are about to drop the column `contextBetId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `contextProduct` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `contextReason` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `retract` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `retract` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "contextBetId",
DROP COLUMN "contextProduct",
DROP COLUMN "contextReason",
DROP COLUMN "retract",
ADD COLUMN     "context" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "retract";
