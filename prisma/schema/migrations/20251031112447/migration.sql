/*
  Warnings:

  - Changed the type of `name` on the `exodus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "exodus" DROP COLUMN "name",
ADD COLUMN     "name" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "exodus_name_sport_uuid_key" ON "exodus"("name", "sport_uuid");
