import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { MeasurementRepository } from '../repositories/measurement-repository';
import { Measurement } from '../entities/measure';
import { MeasurementFilter } from '../filters/measurement-filter';

const confirmMeasurementBodySchema = z.object({
  measure_uuid: z.string(),
  confirmed_value: z.number()
});

interface ConfirmMeasurementUseCaseRequest {
  measure_uuid: string;
  confirmed_value: number;
}

export interface ConfirmMeasurementUseCaseError {
  error_code: string;
  error_description: string;
}

export interface ConfirmMeasurementUseCaseSuccess {
  success: boolean;
}

export type ConfirmMeasurementUseCaseResponse = Either<ConfirmMeasurementUseCaseError, ConfirmMeasurementUseCaseSuccess>;

@Injectable()
export class ConfirmMeasurementUseCase {
  constructor(private measurementRepository: MeasurementRepository) { }

  public async execute({
    measure_uuid,
    confirmed_value
  }: ConfirmMeasurementUseCaseRequest): Promise<ConfirmMeasurementUseCaseResponse> {

    const validation = confirmMeasurementBodySchema.safeParse({
      measure_uuid,
      confirmed_value
    });

    if (!validation.success) {
      const errorDetails: string = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return left({
        error_code: 'INVALID_DATA',
        error_description: errorDetails
      });
    }

    const filter = new MeasurementFilter();
    filter.measurementId = measure_uuid;
    const measurement: Measurement | null = await this.measurementRepository.findById(filter);
    if (!measurement) {
      return left({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura do mês já realizada'
      });
    }

    if (measurement.hasConfirmed) {
      return left({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada'
      });
    }

    await this.measurementRepository.confirmValue(measure_uuid, confirmed_value);

    return right({
      success: true
    });

  }
}