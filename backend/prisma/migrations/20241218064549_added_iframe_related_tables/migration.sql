-- CreateTable
CREATE TABLE "global_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "iframeHost" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "global_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iframe_hosts" (
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,

    CONSTRAINT "iframe_hosts_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "global_users_email_key" ON "global_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "iframe_hosts_ip_key" ON "iframe_hosts"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "iframe_hosts_endpoint_key" ON "iframe_hosts"("endpoint");
