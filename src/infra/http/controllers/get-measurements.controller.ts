import { MeasurementType } from '@/domain/entities/measurement-type';
import {
  GetMeasurementsUseCase,
  GetMeasurementsUseCaseError,
  GetMeasurementsUseCaseResponse,
  GetMeasurementsUseCaseSuccess
} from '@/domain/use-cases/get-measurements';
import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { MeasurementPresenter } from '../presenters/measurement-presenter';

@Controller('/:customer_code/list')
export class GetMeasurementsController {
  constructor(private readonly getMeasurementsUseCase: GetMeasurementsUseCase) { }

  @Get()
  public async handle(
    @Param('customer_code') customer_code: string,
    @Res() res: Response,
    @Query('measure_type') measure_type?: MeasurementType,
  ): Promise<void> {
    const result: GetMeasurementsUseCaseResponse = await this.getMeasurementsUseCase.execute({
      customer_code,
      measure_type,
    });

    if (result.isLeft()) {
      const error: GetMeasurementsUseCaseError = result.value;
      switch (error.error_code) {
        case 'INVALID_DATA':
          res.status(HttpStatus.BAD_REQUEST).json(error);
          break;
        case 'MEASURES_NOT_FOUND':
          res.status(HttpStatus.NOT_FOUND).json(error);
          break;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error_code: 'UNKNOWN_ERROR',
            error_description: 'An unknown error occurred'
          });
      }
    } else {
      const success: GetMeasurementsUseCaseSuccess = result.value;
      const response = {
        customer_code: success.customer_code,
        measurements: success.measurements.map((measurement) => MeasurementPresenter.toHttp(measurement)),
      };
      res.status(HttpStatus.OK).json(response);
    }
  }
}