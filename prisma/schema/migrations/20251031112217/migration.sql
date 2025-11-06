/*
  Warnings:

  - The `name` column on the `sport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "public"."sport_name_key";

-- AlterTable
ALTER TABLE "sport" DROP COLUMN "name",
ADD COLUMN     "name" JSONB NOT NULL DEFAULT '{}';
