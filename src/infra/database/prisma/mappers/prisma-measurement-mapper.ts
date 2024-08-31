import { Measurement } from '@/domain/entities/measure';
import { MeasurementType } from '@/domain/entities/measurement-type';
import { Measurement as PrismaMeasurement, $Enums, Prisma } from '@prisma/client';

export class PrismaMeasurementMapper {

  static toDomain(measurement: PrismaMeasurement): Measurement {
    return new Measurement(
      measurement.customer_code,
      measurement.measurement_datetime,
      PrismaMeasurementMapper.mapMeasurementType(measurement.measurement_type),
      measurement.image_url,
      measurement.measurement_value,
      measurement.has_confirmed,
      measurement.id
    );
  }

  static toPrisma(measurement: Measurement): Prisma.MeasurementUncheckedCreateInput {
    return {
      id: measurement.id,
      customer_code: measurement.customerCode,
      measurement_datetime: measurement.measurementDatetime,
      measurement_type: PrismaMeasurementMapper.mapMeasurementType(measurement.measurementType),
      image_url: measurement.imageUrl,
      measurement_value: measurement.measurementValue,
      has_confirmed: measurement.hasConfirmed,
    };
  }

  private static mapMeasurementType(type: $Enums.MeasurementType) {
    switch (type) {
      case 'WATER':
        return MeasurementType.WATER;
      case 'GAS':
        return MeasurementType.GAS;
      default:
        throw new Error(`Invalid type: ${type}`);
    }
  }

}