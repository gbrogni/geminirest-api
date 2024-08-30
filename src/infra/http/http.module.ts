import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UpdateFileController } from './controllers/upload-file.controller';
import { UploadFileUseCase } from '@/domain/use-cases/upload-file';
import { GeminiModule } from '../gemini/gemini.module';
import { ConfirmMeasurementController } from './controllers/confirm-measurement.controller';
import { ConfirmMeasurementUseCase } from '@/domain/use-cases/confirm-measurement';

@Module({
  imports: [DatabaseModule, GeminiModule],
  controllers: [
    UpdateFileController,
    ConfirmMeasurementController
  ],
  providers: [
    UploadFileUseCase,
    ConfirmMeasurementUseCase
  ],
})
export class HttpModule { }