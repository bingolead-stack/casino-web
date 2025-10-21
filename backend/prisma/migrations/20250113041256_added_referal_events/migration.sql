-- CreateTable
CREATE TABLE "referral_events" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "referral_events_pkey" PRIMARY KEY ("id")
);
