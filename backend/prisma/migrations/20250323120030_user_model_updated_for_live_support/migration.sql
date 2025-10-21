-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "smSupporterCursor" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "smUserCursor" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "supportingUser" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "support_messages" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "supporterId" TEXT,
    "message" TEXT NOT NULL,
    "filepaths" TEXT[],
    "filenames" TEXT[],
    "replyId" BIGINT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isEdited" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
