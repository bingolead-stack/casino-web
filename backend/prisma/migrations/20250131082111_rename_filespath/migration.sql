/*
  Warnings:

  - You are about to drop the column `filespaths` on the `chat_messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "filespaths",
ADD COLUMN     "filepaths" TEXT[];
