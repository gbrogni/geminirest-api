import { Measurement } from '../entities/measure';
import { MeasurementType } from '../entities/measurement-type';
import { MeasurementFilter } from '../filters/measurement-filter';

export abstract class MeasurementRepository {
  abstract existsMonthlyCheck(customer_code: string, measurement_datetime: Date, measure_type: MeasurementType): Promise<boolean>;
  abstract find(filter: MeasurementFilter): Promise<Measurement[]>;
  abstract findById(filter: MeasurementFilter): Promise<Measurement | null>;
  abstract save(measurement: Measurement): Promise<void>;
  abstract confirmValue(measurement_uuid: string, confirmed_value: number): Promise<void>;
}