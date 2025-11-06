/*
  Warnings:

  - You are about to drop the `ServiceSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."ServiceSettings";

-- CreateTable
CREATE TABLE "service_settings" (
    "uuid" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_settings_pkey" PRIMARY KEY ("uuid")
);
