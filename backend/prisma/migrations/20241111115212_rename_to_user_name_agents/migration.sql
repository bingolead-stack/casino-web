/*
  Warnings:

  - You are about to drop the column `name` on the `agents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `agents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `agents` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "agents_name_key";

-- AlterTable
ALTER TABLE "agents" DROP COLUMN "name",
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "agents_userName_key" ON "agents"("userName");
