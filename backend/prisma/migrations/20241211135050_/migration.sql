/*
  Warnings:

  - The primary key for the `vpn_users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "vpn_users" DROP CONSTRAINT "vpn_users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "vpn_users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "vpn_users_id_seq";
