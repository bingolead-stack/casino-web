-- DropIndex
DROP INDEX "agents_userName_key";

-- DropIndex
DROP INDEX "users_userName_key";

-- CreateIndex
CREATE INDEX "transactions_eventId_eventType_gameId_platform_userId_idx" ON "transactions"("eventId", "eventType", "gameId", "platform", "userId");
