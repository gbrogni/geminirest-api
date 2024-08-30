import { GenAiResponse } from '@/infra/gemini/interfaces/gen-ai-response';

export abstract class IGeminiService {
  abstract generateTextFromMultiModal(prompt: string, image: string): Promise<GenAiResponse>;
}