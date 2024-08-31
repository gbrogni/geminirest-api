-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "measurement_value" INTEGER NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "measurement_datetime" TIMESTAMP(3) NOT NULL,
    "measurement_type" "MeasurementType" NOT NULL,
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
