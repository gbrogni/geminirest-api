import { ConfirmMeasurementUseCase, ConfirmMeasurementUseCaseError, ConfirmMeasurementUseCaseResponse, ConfirmMeasurementUseCaseSuccess } from '@/domain/use-cases/confirm-measurement';
import { Body, Controller, HttpStatus, Patch, Res } from '@nestjs/common';
import { Response } from 'express';

interface ConfirmMeasurementBodySchema {
  measure_uuid: string;
  confirmed_value: number;
}

@Controller('/confirm')
export class ConfirmMeasurementController {
  constructor(private readonly confirmMeasurementUseCase: ConfirmMeasurementUseCase) { }

  @Patch()
  public async handle(
    @Body() body: ConfirmMeasurementBodySchema,
    @Res() res: Response
  ): Promise<void> {
    const { measure_uuid, confirmed_value } = body;

    const result: ConfirmMeasurementUseCaseResponse = await this.confirmMeasurementUseCase.execute({
      measure_uuid,
      confirmed_value
    });

    if (result.isLeft()) {
      const error: ConfirmMeasurementUseCaseError = result.value;
      switch (error.error_code) {
        case 'INVALID_DATA':
          res.status(HttpStatus.BAD_REQUEST).json(error);
          break;
        case 'MEASURE_NOT_FOUND':
          res.status(HttpStatus.NOT_FOUND).json(error);
          break;
        case 'CONFIRMATION_DUPLICATE':
          res.status(HttpStatus.CONFLICT).json(error);
          break;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error_code: 'UNKNOWN_ERROR',
            error_description: 'An unknown error occurred'
          });
      }
    } else {
      const success: ConfirmMeasurementUseCaseSuccess = result.value;
      res.status(HttpStatus.OK).json(success);
    }

  }
}