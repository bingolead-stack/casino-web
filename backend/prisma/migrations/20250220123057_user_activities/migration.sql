-- CreateEnum
CREATE TYPE "UserActivityType" AS ENUM ('LOGIN', 'LOGOUT', 'PLAYGAME', 'DEPOSIT', 'WITHDRAW');

-- CreateTable
CREATE TABLE "user_activities" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "UserActivityType" NOT NULL,
    "gameId" INTEGER,
    "gameName" TEXT,
    "providerId" INTEGER,
    "providerName" TEXT,
    "ip" TEXT NOT NULL,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
