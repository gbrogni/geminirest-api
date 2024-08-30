import { Measurement } from '../entities/measure';
import { MeasurementType } from '../entities/measurement-type';

export abstract class MeasurementRepository {
  abstract existsMonthlyCheck(customer_code: string, measurement_datetime: Date, measure_type: MeasurementType): Promise<boolean>;
  abstract findById(measurement_uuid: string): Promise<Measurement | null>;
  abstract confirmValue(measurement_uuid: string, confirmed_value: number): Promise<void>;
}