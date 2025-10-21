-- CreateTable
CREATE TABLE "xswiftly_requests" (
    "invoiceNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "statusText" TEXT,
    "message" TEXT,
    "issuedAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xswiftly_requests_pkey" PRIMARY KEY ("invoiceNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "xswiftly_requests_transactionId_key" ON "xswiftly_requests"("transactionId");

-- AddForeignKey
ALTER TABLE "xswiftly_requests" ADD CONSTRAINT "xswiftly_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
