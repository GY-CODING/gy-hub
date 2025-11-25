import { getGeminiService } from "../shared/services/gemini.service";
import { GYCODING_SYSTEM_PROMPT } from "./constants";

export class GyCodingService {
  private gemini = getGeminiService();

  async generateResponse(prompt: string): Promise<string> {
    return this.gemini.generateWithContext(GYCODING_SYSTEM_PROMPT, prompt);
  }
}
