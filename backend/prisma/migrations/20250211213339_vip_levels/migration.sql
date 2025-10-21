-- CreateTable
CREATE TABLE "vip_levels" (
    "id" INTEGER NOT NULL,
    "wagered" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rakeback" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashback" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "vip_levels_pkey" PRIMARY KEY ("id")
);
