import { z } from 'zod';
import { MeasurementType } from '../entities/measurement-type';
import { Measurement } from '../entities/measure';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { MeasurementRepository } from '../repositories/measurement-repository';
import { MeasurementFilter } from '../filters/measurement-filter';

const getMeasurementsSchema = z.object({
  customer_code: z.string(),
  measure_type: z.string().optional()
});

interface GetMeasurementsUseCaseRequest {
  customer_code: string;
  measure_type?: string;
}

export interface GetMeasurementsUseCaseError {
  error_code: string;
  error_description: string;
}

export interface GetMeasurementsUseCaseSuccess {
  customer_code: string;
  measurements: Measurement[];
}

export type GetMeasurementsUseCaseResponse = Either<GetMeasurementsUseCaseError, GetMeasurementsUseCaseSuccess>;

@Injectable()
export class GetMeasurementsUseCase {
  constructor(
    private measurementRepository: MeasurementRepository
  ) { }

  public async execute({
    customer_code,
    measure_type,
  }: GetMeasurementsUseCaseRequest): Promise<GetMeasurementsUseCaseResponse> {

    const validation = getMeasurementsSchema.safeParse({
      customer_code,
      measure_type
    });

    if (!validation.success) {
      return left({
        error_code: 'INVALID_DATA',
        error_description: 'Tipo de medição não permitida'
      });
    }

    let normalizedMeasureType: MeasurementType | undefined;
    if (measure_type) {
      normalizedMeasureType = MeasurementType[measure_type.toUpperCase() as keyof typeof MeasurementType];
      if (!normalizedMeasureType) {
        return left({
          error_code: 'INVALID_DATA',
          error_description: 'Tipo de medição não permitida'
        });
      }
    }

    const filter = new MeasurementFilter();
    filter.customerCode = customer_code;
    filter.measureType = normalizedMeasureType;

    const measurements: Measurement[] = await this.measurementRepository.find(filter);

    if (!measurements || !measurements.length) {
      return left({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada'
      });
    }

    return right({
      customer_code,
      measurements
    });
  }
}