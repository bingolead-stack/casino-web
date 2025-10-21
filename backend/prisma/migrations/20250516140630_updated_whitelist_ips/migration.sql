/*
  Warnings:

  - The primary key for the `whitelist_ips` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "whitelist_ips" DROP CONSTRAINT "whitelist_ips_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "whitelist_ips_pkey" PRIMARY KEY ("id");
