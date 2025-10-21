/*
  Warnings:

  - Added the required column `country` to the `user_activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserActivityType" ADD VALUE 'REGISTER';

-- AlterTable
ALTER TABLE "user_activities" ADD COLUMN     "cash" INTEGER,
ADD COLUMN     "country" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "withdraw_requests" ADD COLUMN     "country" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ip" TEXT NOT NULL DEFAULT '';
