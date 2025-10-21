-- DropIndex
DROP INDEX "transactions_eventId_eventType_gameId_platform_userId_idx";

-- CreateIndex
CREATE INDEX "transactions_eventId_idx" ON "transactions"("eventId");

-- CreateIndex
CREATE INDEX "transactions_eventType_idx" ON "transactions"("eventType");

-- CreateIndex
CREATE INDEX "transactions_gameId_idx" ON "transactions"("gameId");

-- CreateIndex
CREATE INDEX "transactions_platform_idx" ON "transactions"("platform");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");
