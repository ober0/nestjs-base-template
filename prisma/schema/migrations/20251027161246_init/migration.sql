-- CreateEnum
CREATE TYPE "MessageSenderType" AS ENUM ('Ai', 'User');

-- CreateEnum
CREATE TYPE "forecast_types" AS ENUM ('Express', 'Ordinar');

-- CreateEnum
CREATE TYPE "match_status" AS ENUM ('Scheduled', 'Live', 'Finished');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('CoefficientChanged', 'MatchStarted', 'RequestLimit');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Completed', 'Failed', 'Canceled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Card', 'Crypto', 'Link', 'Other');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'RUB', 'AMD');

-- CreateEnum
CREATE TYPE "tariff_status" AS ENUM ('Active', 'Expired', 'Canceled');

-- CreateTable
CREATE TABLE "chat" (
    "uuid" UUID NOT NULL,
    "forecast_uuid" UUID NOT NULL,
    "match_uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "message" (
    "uuid" UUID NOT NULL,
    "chat_uuid" UUID NOT NULL,
    "type" "MessageSenderType" NOT NULL,
    "text" TEXT NOT NULL,
    "json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "forecast" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "forecast" JSONB NOT NULL,
    "type" "forecast_types" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forecast_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "forecast_match" (
    "forecast_uuid" UUID NOT NULL,
    "match_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forecast_match_pkey" PRIMARY KEY ("forecast_uuid","match_uuid")
);

-- CreateTable
CREATE TABLE "sport" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sport_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "exodus" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sport_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exodus_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "match" (
    "uuid" UUID NOT NULL,
    "sport_uuid" UUID NOT NULL,
    "league" TEXT NOT NULL,
    "team_a" TEXT NOT NULL,
    "team_b" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "match_odds" (
    "uuid" UUID NOT NULL,
    "match_uuid" UUID NOT NULL,
    "exodus_uuid" UUID NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_odds_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "notification" (
    "uuid" UUID NOT NULL,
    "type" "notification_type" NOT NULL,
    "title" TEXT NOT NULL,
    "title_eng" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "description_eng" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "user_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Payment" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "description" TEXT,
    "externalId" TEXT,
    "metadata" JSONB,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "permission" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "role" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_uuid" UUID NOT NULL,
    "permission_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_uuid","permission_uuid")
);

-- CreateTable
CREATE TABLE "tariff" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariff_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tariff_price" (
    "uuid" UUID NOT NULL,
    "tariff_uuid" UUID NOT NULL,
    "period_uuid" UUID NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariff_price_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tariff_limit" (
    "uuid" UUID NOT NULL,
    "tariff_uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER,
    "is_unlimited" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariff_limit_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tariff_period" (
    "uuid" UUID NOT NULL,
    "days" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariff_period_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "user_tariff" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "tariff_uuid" UUID NOT NULL,
    "status" "tariff_status" NOT NULL DEFAULT 'Active',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "tariff_period_uuid" UUID NOT NULL,
    "paymentUuid" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tariff_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "uuid" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Password" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "person" (
    "uuid" UUID NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "date_of_birthday" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "user" (
    "uuid" UUID NOT NULL,
    "phone_number" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "personUuid" UUID NOT NULL,
    "email" TEXT,
    "role_uuid" UUID NOT NULL,
    "aiRequestUsage" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "user_info" (
    "uuid" UUID NOT NULL,
    "forecast_count" INTEGER NOT NULL,
    "accuracy_percent" INTEGER NOT NULL,
    "profit_percent" INTEGER NOT NULL,
    "user_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "settings" (
    "uuid" UUID NOT NULL,
    "json" JSONB NOT NULL,
    "user_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_forecast_uuid_key" ON "chat"("forecast_uuid");

-- CreateIndex
CREATE INDEX "forecast_user_uuid_idx" ON "forecast"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "sport_name_key" ON "sport"("name");

-- CreateIndex
CREATE UNIQUE INDEX "exodus_name_sport_uuid_key" ON "exodus"("name", "sport_uuid");

-- CreateIndex
CREATE INDEX "match_team_a_idx" ON "match"("team_a");

-- CreateIndex
CREATE INDEX "match_team_b_idx" ON "match"("team_b");

-- CreateIndex
CREATE UNIQUE INDEX "match_odds_match_uuid_exodus_uuid_key" ON "match_odds"("match_uuid", "exodus_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tariff_name_key" ON "tariff"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tariff_price_tariff_uuid_period_uuid_key" ON "tariff_price"("tariff_uuid", "period_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tariff_limit_tariff_uuid_name_key" ON "tariff_limit"("tariff_uuid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "tariff_period_days_key" ON "tariff_period"("days");

-- CreateIndex
CREATE UNIQUE INDEX "user_tariff_paymentUuid_key" ON "user_tariff"("paymentUuid");

-- CreateIndex
CREATE INDEX "user_tariff_status_idx" ON "user_tariff"("status");

-- CreateIndex
CREATE INDEX "user_tariff_user_uuid_tariff_uuid_status_idx" ON "user_tariff"("user_uuid", "tariff_uuid", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Password_user_uuid_key" ON "Password"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_number_key" ON "user"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_info_user_uuid_key" ON "user_info"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_uuid_key" ON "settings"("user_uuid");

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_forecast_uuid_fkey" FOREIGN KEY ("forecast_uuid") REFERENCES "forecast"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_match_uuid_fkey" FOREIGN KEY ("match_uuid") REFERENCES "match"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chat_uuid_fkey" FOREIGN KEY ("chat_uuid") REFERENCES "chat"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast" ADD CONSTRAINT "forecast_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_match" ADD CONSTRAINT "forecast_match_forecast_uuid_fkey" FOREIGN KEY ("forecast_uuid") REFERENCES "forecast"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_match" ADD CONSTRAINT "forecast_match_match_uuid_fkey" FOREIGN KEY ("match_uuid") REFERENCES "match"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exodus" ADD CONSTRAINT "exodus_sport_uuid_fkey" FOREIGN KEY ("sport_uuid") REFERENCES "sport"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_sport_uuid_fkey" FOREIGN KEY ("sport_uuid") REFERENCES "sport"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_odds" ADD CONSTRAINT "match_odds_match_uuid_fkey" FOREIGN KEY ("match_uuid") REFERENCES "match"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_odds" ADD CONSTRAINT "match_odds_exodus_uuid_fkey" FOREIGN KEY ("exodus_uuid") REFERENCES "exodus"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_uuid_fkey" FOREIGN KEY ("permission_uuid") REFERENCES "permission"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_uuid_fkey" FOREIGN KEY ("role_uuid") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_price" ADD CONSTRAINT "tariff_price_tariff_uuid_fkey" FOREIGN KEY ("tariff_uuid") REFERENCES "tariff"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_price" ADD CONSTRAINT "tariff_price_period_uuid_fkey" FOREIGN KEY ("period_uuid") REFERENCES "tariff_period"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_limit" ADD CONSTRAINT "tariff_limit_tariff_uuid_fkey" FOREIGN KEY ("tariff_uuid") REFERENCES "tariff"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tariff" ADD CONSTRAINT "user_tariff_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tariff" ADD CONSTRAINT "user_tariff_tariff_uuid_fkey" FOREIGN KEY ("tariff_uuid") REFERENCES "tariff"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tariff" ADD CONSTRAINT "user_tariff_tariff_period_uuid_fkey" FOREIGN KEY ("tariff_period_uuid") REFERENCES "tariff_period"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tariff" ADD CONSTRAINT "user_tariff_paymentUuid_fkey" FOREIGN KEY ("paymentUuid") REFERENCES "Payment"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_personUuid_fkey" FOREIGN KEY ("personUuid") REFERENCES "person"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_uuid_fkey" FOREIGN KEY ("role_uuid") REFERENCES "role"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
