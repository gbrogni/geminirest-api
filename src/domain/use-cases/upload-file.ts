import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { IGeminiService } from '../services/gemini-service';
import { GenAiResponse } from '../../infra/gemini/interfaces/gen-ai-response';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { MeasurementRepository } from '../repositories/measurement-repository';
import { MeasurementType } from '../entities/measurement-type';

const uploadFileBodySchema = z.object({
  image: z.string().refine((val) => {
    try {
      return Buffer.from(val, 'base64').toString('base64') === val;
    } catch {
      return false;
    }
  }, {
    message: "Invalid base64 string"
  }),
  customer_code: z.string(),
  measure_datetime: z.date(),
  measure_type: z.nativeEnum(MeasurementType)
});

interface UploadFileUseCaseRequest {
  image: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: MeasurementType;
}

export interface UploadFileUseCaseError {
  error_code: string;
  error_description: string;
}

export interface UploadFileUseCaseSuccess {
  image_url: string;
  measure_value: number;
  measure_uuid: string;
}

export type UploadFileUseCaseResponse = Either<UploadFileUseCaseError, UploadFileUseCaseSuccess>;

@Injectable()
export class UploadFileUseCase {
  constructor(
    private geminiSerice: IGeminiService,
    private measurementRepository: MeasurementRepository
  ) { }

  public async execute({
    image,
    customer_code,
    measure_datetime,
    measure_type,
  }: UploadFileUseCaseRequest): Promise<UploadFileUseCaseResponse> {

    const validation = uploadFileBodySchema.safeParse({
      image,
      customer_code,
      measure_datetime,
      measure_type
    });

    if (!validation.success) {
      const errorDetails: string = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return left({
        error_code: 'INVALID_DATA',
        error_description: errorDetails,
      });
    }

    const alreadyExistsMonthlyCheck: boolean = await this.measurementRepository.existsMonthlyCheck(
      customer_code,
      measure_datetime,
      measure_type
    );

    if (alreadyExistsMonthlyCheck) {
      return left({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada'
      });
    }

    const genAiResponse: GenAiResponse = await this.geminiSerice.generateTextFromMultiModal(
      'em somente um número, me informe qual o numero que esta na imagem, sem mais nenhum texto, somente o numero',
      image
    );

    const measure_uuid: string = uuidv4();
    const base64Data: string = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer: Buffer = Buffer.from(base64Data, 'base64');
    const tempDir: string = path.join(__dirname, '..', 'temp-images');
    const imagePath: string = path.join(tempDir, `${measure_uuid}.jpg`);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    fs.writeFileSync(imagePath, buffer);

    const image_url: string = `http://localhost:3000/temp-images/${measure_uuid}.jpg`;
    const measure_value = parseFloat(genAiResponse.text);

    return right({
      image_url,
      measure_value,
      measure_uuid,
    });
  }
}
