import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UploadFileUseCase, UploadFileUseCaseResponse, UploadFileUseCaseError, UploadFileUseCaseSuccess } from '@/domain/use-cases/upload-file';
import { MeasurementType } from '@/domain/entities/measurement-type';

interface UploadFileBodySchema {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: MeasurementType;
}

@Controller('/upload')
export class UpdateFileController {
  constructor(private readonly updateFileUseCase: UploadFileUseCase) { }

  @Post()
  public async handle(
    @Body() body: UploadFileBodySchema,
    @Res() res: Response
  ): Promise<void> {
    const { image, customer_code, measure_datetime, measure_type } = body;

    const result: UploadFileUseCaseResponse = await this.updateFileUseCase.execute({
      image,
      customer_code,
      measure_datetime: new Date(measure_datetime),
      measure_type
    });

    if (result.isLeft()) {
      const error: UploadFileUseCaseError = result.value;
      switch (error.error_code) {
        case 'DOUBLE_REPORT':
          res.status(HttpStatus.CONFLICT).json(error);
          break;
        case 'INVALID_DATA':
          res.status(HttpStatus.BAD_REQUEST).json(error);
          break;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error_code: 'UNKNOWN_ERROR',
            error_description: 'An unknown error occurred'
          });
      }
    } else {
      const success: UploadFileUseCaseSuccess = result.value;
      res.status(HttpStatus.OK).json(success);
    }
  }
}
