/*
  Warnings:

  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "message_sender_type" AS ENUM ('Ai', 'User');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('Pending', 'Completed', 'Failed', 'Canceled');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('Card', 'Crypto', 'Link', 'Other');

-- CreateEnum
CREATE TYPE "currency" AS ENUM ('USD', 'EUR', 'RUB', 'AMD');

-- DropForeignKey
ALTER TABLE "public"."Password" DROP CONSTRAINT "Password_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_tariff" DROP CONSTRAINT "user_tariff_paymentUuid_fkey";

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "authorUuid" UUID,
DROP COLUMN "type",
ADD COLUMN     "type" "message_sender_type" NOT NULL;

-- DropTable
DROP TABLE "public"."Password";

-- DropTable
DROP TABLE "public"."Payment";

-- DropEnum
DROP TYPE "public"."Currency";

-- DropEnum
DROP TYPE "public"."MessageSenderType";

-- DropEnum
DROP TYPE "public"."PaymentMethod";

-- DropEnum
DROP TYPE "public"."PaymentStatus";

-- CreateTable
CREATE TABLE "payment" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" "currency" NOT NULL,
    "description" TEXT,
    "externalId" TEXT,
    "metadata" JSONB,
    "method" "payment_method" NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "password" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_user_uuid_key" ON "password"("user_uuid");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_authorUuid_fkey" FOREIGN KEY ("authorUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tariff" ADD CONSTRAINT "user_tariff_paymentUuid_fkey" FOREIGN KEY ("paymentUuid") REFERENCES "payment"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password" ADD CONSTRAINT "password_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
