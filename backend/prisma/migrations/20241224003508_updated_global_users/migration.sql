/*
  Warnings:

  - The primary key for the `global_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `global_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "global_users" DROP CONSTRAINT "global_users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "global_users_pkey" PRIMARY KEY ("id");
