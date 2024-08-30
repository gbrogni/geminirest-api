import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from '../config/gemini.config';
import { EnvService } from '../../env/env.service';

export const GEMINI_PRO_VISION_MODEL = 'GEMINI_PRO_VISION_MODEL';

export const GeminiProVisionModelProvider: Provider<GenerativeModel> = {
  provide: GEMINI_PRO_VISION_MODEL,
  useFactory: (envService: EnvService) => {
    const geminiKey: string = envService.get('GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(geminiKey);
    return genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });
  },
  inject: [EnvService],
};