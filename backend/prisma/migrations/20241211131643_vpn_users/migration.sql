-- CreateTable
CREATE TABLE "vpn_users" (
    "id" SERIAL NOT NULL,
    "vpnUsername" TEXT NOT NULL,
    "vpnPassword" TEXT NOT NULL,
    "expiryDate" TIMESTAMPTZ(3) NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "vpn_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vpn_users_email_key" ON "vpn_users"("email");

-- AddForeignKey
ALTER TABLE "vpn_users" ADD CONSTRAINT "vpn_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
