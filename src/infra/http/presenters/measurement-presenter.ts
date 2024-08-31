import { Measurement } from '@/domain/entities/measure';

export class MeasurementPresenter {

  public static toHttp(measurement: Measurement) {
    return {
      measure_uuid: measurement.id,
      measure_datetime: measurement.measurementDatetime,
      measure_type: measurement.measurementType,
      has_confirmed: measurement.hasConfirmed,
      image_url: measurement.imageUrl,
    };
  }

}