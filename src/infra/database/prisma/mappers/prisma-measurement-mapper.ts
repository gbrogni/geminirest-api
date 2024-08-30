import { Measurement } from '@/domain/entities/measure';
import { MeasurementType } from '@/domain/entities/measurement-type';
import { Measurement as PrismaMeasurement, $Enums } from '@prisma/client';

export class PrismaMeasurementMapper {

  static toDomain(measurement: PrismaMeasurement): Measurement {
    return new Measurement({
      id: measurement.id,
      customerCode: measurement.customer_code,
      measurementDatetime: measurement.measurement_datetime,
      measurementType: this.mapMeasurementType(measurement.measurement_type),
      imageUrl: measurement.image_url,
      measurementValue: measurement.measurement_value,
      hasConfirmed: measurement.has_confirmed,
      createdAt: measurement.createdAt,
      updatedAt: measurement.updatedAt
    });
  }

  private static mapMeasurementType(type: $Enums.MeasurementType): MeasurementType {
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