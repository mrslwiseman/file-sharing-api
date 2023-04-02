-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "file" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "private_key" TEXT NOT NULL,
    "created" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_accessed" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "limit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ip" INET NOT NULL,
    "date" DATE NOT NULL,
    "upload_kb" BIGINT NOT NULL,
    "download_kb" BIGINT NOT NULL,

    CONSTRAINT "limit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "file_public_key_key" ON "file"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "file_private_key_key" ON "file"("private_key");

-- CreateIndex
CREATE INDEX "file_last_accessed_idx" ON "file"("last_accessed");

-- CreateIndex
CREATE UNIQUE INDEX "limit_ip_date_key" ON "limit"("ip", "date");
