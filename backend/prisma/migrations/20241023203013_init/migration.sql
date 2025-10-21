-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('deposit', 'withdrawal', 'rollback');

-- CreateEnum
CREATE TYPE "ApprovedStatus" AS ENUM ('PENDING', 'APPROVED', 'BANNED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('NORMAL', 'ADMIN', 'SUB_USER', 'AGENT');

-- CreateEnum
CREATE TYPE "TransactionPlatform" AS ENUM ('SPORTSBOOK', 'CRYPTO', 'CARD', 'VISA', 'GOOGLE_PAY', 'APPLE_PAY', 'ADMIN', 'AGENT');

-- CreateEnum
CREATE TYPE "TransactionCurrency" AS ENUM ('AUD', 'AZN', 'BDT', 'BOB', 'BRL', 'CAD', 'CLP', 'EUR', 'GEL', 'GHS', 'HUF', 'IDR', 'INR', 'IRR', 'KES', 'KGS', 'KZT', 'LKR', 'MDL', 'MXN', 'MYR', 'MZN', 'NGN', 'NPR', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'RON', 'SGD', 'THB', 'TJS', 'TMT', 'TZS', 'UAH', 'USD', 'UXB', 'UYU', 'UZS', 'VND', 'XOF', 'USDT', 'USDC', 'DAI', 'MATIC', 'TRX', 'METH', 'UBTC');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyCode" TEXT NOT NULL,
    "verityTimeLimit" TIMESTAMPTZ(3) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'NORMAL',
    "agentId" TEXT,
    "referCode" TEXT NOT NULL,
    "refererId" TEXT,
    "subscription" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "cash" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL,
    "locked" DOUBLE PRECISION NOT NULL,
    "retract" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "txnId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "wallet" TEXT NOT NULL,
    "timestamp" DECIMAL(60,0) NOT NULL,
    "chainId" INTEGER NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "tokenAmount" DECIMAL(60,4) NOT NULL,
    "approved" "ApprovedStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "referCode" TEXT NOT NULL DEFAULT '',
    "refererId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_transactions" (
    "id" SERIAL NOT NULL,
    "agentId" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "agent_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nft_wallets" (
    "id" SERIAL NOT NULL,
    "polygonAddress" TEXT NOT NULL,
    "solanaAddress" TEXT NOT NULL,
    "nftAmount" INTEGER NOT NULL,

    CONSTRAINT "nft_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "cash" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL,
    "locked" DOUBLE PRECISION NOT NULL,
    "retract" DOUBLE PRECISION NOT NULL,
    "io" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "platform" TEXT NOT NULL,
    "currency" "TransactionCurrency" NOT NULL DEFAULT 'USD',
    "initiatedAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL,
    "contextProduct" TEXT,
    "contextReason" TEXT,
    "contextBetId" TEXT,
    "userId" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "tokenAddress" TEXT,
    "tokenAmount" DOUBLE PRECISION NOT NULL,
    "isDeleted" INTEGER NOT NULL,
    "note" TEXT,
    "alreadyProcessed" BOOLEAN NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whitelist_ips" (
    "ip" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "whitelist_ips_pkey" PRIMARY KEY ("ip")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_transactions_txnId_key" ON "wallet_transactions"("txnId");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_wallet_key" ON "wallets"("userId", "wallet");

-- CreateIndex
CREATE UNIQUE INDEX "agents_name_key" ON "agents"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_userId_wallet_fkey" FOREIGN KEY ("userId", "wallet") REFERENCES "wallets"("userId", "wallet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_transactions" ADD CONSTRAINT "agent_transactions_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
