/*
  Warnings:

  - The `device` column on the `fungamess_games` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "fungamess_games" DROP COLUMN "device",
ADD COLUMN     "device" TEXT;

-- DropEnum
DROP TYPE "FungamessGameDevice";
