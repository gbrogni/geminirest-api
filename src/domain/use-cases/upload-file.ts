import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { IGeminiService } from '../services/gemini-service';
import { GenAiResponse } from '../../infra/gemini/interfaces/gen-ai-response';
import { z } from 'zod';
import { MeasurementRepository } from '../repositories/measurement-repository';
import { MeasurementType } from '../entities/measurement-type';
import { Either, left, right } from '@/core/either';
import { Measurement } from '../entities/measure';
import { CustomerRepository } from '../repositories/customer-repository';
import { Customer } from '../entities/customer';

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
    private measurementRepository: MeasurementRepository,
    private customerRepository: CustomerRepository
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

    const customer: Customer | null = await this.customerRepository.findById(customer_code);
    if (!customer) {
      return left({
        error_code: 'INVALID_DATA',
        error_description: 'Cliente não encontrado'
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
      'Informe somente o número em que aparece no medidor, sem nenhum texto, somente o número.',
      image
    );

    const measure_uuid: string = uuidv4();
    const measure_value: number = parseFloat(genAiResponse.text);

    const imageBuffer: Buffer = Buffer.from(image, 'base64');
    const imageFileName = `${measure_uuid}.jpg`;
    const imagePath: string = path.join(process.cwd(), 'temp-images', imageFileName);

    fs.mkdirSync(path.dirname(imagePath), { recursive: true });

    fs.writeFileSync(imagePath, imageBuffer);

    const image_url = `http://localhost:3000/temp-images/${imageFileName}`;
    const newImagePath = `/temp-images/${imageFileName}`;

    const measurement = new Measurement(customer_code, measure_datetime, measure_type, newImagePath, measure_value, false, measure_uuid);
    this.measurementRepository.save(measurement);

    return right({
      image_url,
      measure_value,
      measure_uuid,
    });
  }
}