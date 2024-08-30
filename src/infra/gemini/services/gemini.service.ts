import { Content, EnhancedGenerateContentResponse, GenerateContentResult, GenerativeModel } from '@google/generative-ai';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GenAiResponse } from '@/infra/gemini/interfaces/gen-ai-response';
import { IGeminiService } from '@/domain/services/gemini-service';
import { createContent } from '../utils/create-content';

@Injectable()
export class GeminiService implements IGeminiService {
  private readonly logger = new Logger(GeminiService.name);

  constructor(
    private readonly model: GenerativeModel,
  ) { }

  public async generateTextFromMultiModal(prompt: string, image: string): Promise<GenAiResponse> {
    const contents: Content[] = createContent(prompt, image);
    return this.processContent(contents);
  }

  private async processContent(contents: Content[]): Promise<GenAiResponse> {
    try {
      const { totalTokens } = await this.model.countTokens({ contents });
      this.logger.log(`Tokens: ${JSON.stringify(totalTokens)}`);

      const result: GenerateContentResult = await this.model.generateContent({ contents });
      const response: EnhancedGenerateContentResponse = result.response;
      const text: string = response.text();

      this.logger.log(JSON.stringify(text));
      return { totalTokens, text };
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message, err.stack);
      }
      throw err;
    }
  }
}