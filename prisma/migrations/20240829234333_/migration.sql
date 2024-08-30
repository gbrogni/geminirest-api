/*
  Warnings:

  - You are about to drop the column `code` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the `Measure` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('WATER', 'GAS');

-- DropForeignKey
ALTER TABLE "Measure" DROP CONSTRAINT "Measure_customer_code_fkey";

-- DropIndex
DROP INDEX "Customer_code_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "code";

-- DropTable
DROP TABLE "Measure";

-- DropEnum
DROP TYPE "MeasureType";

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "measurement_value" INTEGER NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "measurement_datetime" TIMESTAMP(3) NOT NULL,
    "measurement_type" "MeasurementType" NOT NULL,
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
