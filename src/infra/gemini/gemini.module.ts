import { Module } from '@nestjs/common';
import { GeminiProVisionModelProvider, GEMINI_PRO_VISION_MODEL } from './providers/gemini-provider';
import { EnvModule } from '../env/env.module';
import { IGeminiService } from '@/domain/services/gemini-service';
import { GeminiService } from './services/gemini.service';
import { GenerativeModel } from '@google/generative-ai';

@Module({
  imports: [EnvModule],
  providers: [
    GeminiProVisionModelProvider,
    {
      provide: IGeminiService,
      useClass: GeminiService,
    },
    {
      provide: GenerativeModel,
      useExisting: GEMINI_PRO_VISION_MODEL,
    },
  ],
  exports: [IGeminiService],
})
export class GeminiModule { }