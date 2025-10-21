/*
  Warnings:

  - You are about to drop the column `bonus_sum` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "bonus_sum",
ADD COLUMN     "bonus_sum" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "wantBonus" BOOLEAN;
