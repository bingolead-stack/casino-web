/*
  Warnings:

  - You are about to drop the column `provider_id` on the `fungamess_providers` table. All the data in the column will be lost.
  - You are about to drop the column `provider_name` on the `fungamess_providers` table. All the data in the column will be lost.
  - Added the required column `slider_image` to the `fungamess_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fungamess_providers" DROP COLUMN "provider_id",
DROP COLUMN "provider_name",
ADD COLUMN     "slider_image" TEXT NOT NULL;
