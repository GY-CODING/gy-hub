import { getFileLoader } from "../shared/services/file-loader.service";
import { getGeminiService } from "../shared/services/gemini.service";
import { HERALDS_FILE_PATH, HERALDS_SYSTEM_PROMPT } from "./constants";

export class HeraldsService {
  private gemini = getGeminiService();
  private fileLoader = getFileLoader();

  async generateResponse(prompt: string): Promise<string> {
    const context = this.loadStoryContext();

    return this.gemini.generateWithContext(
      HERALDS_SYSTEM_PROMPT,
      prompt,
      context
    );
  }

  private loadStoryContext(): string {
    return this.fileLoader.loadFile(HERALDS_FILE_PATH);
  }
}
