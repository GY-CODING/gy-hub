import { GoogleGenAI } from "@google/genai";
import {
  GeminiClient,
  GeminiGenerateOptions,
  GeminiModel,
} from "../types/gemini";

export class GeminiService {
  private client: GeminiClient;
  private readonly defaultModel: GeminiModel = "gemini-2.5-flash";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateContent(
    options: Partial<GeminiGenerateOptions>
  ): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: options.model || this.defaultModel,
        contents: options.contents || [],
      });

      const text = await response.text;
      return text || "";
    } catch (error) {
      console.error("Gemini generation error:", error);
      throw new Error("Failed to generate content with Gemini");
    }
  }

  async generateWithContext(
    systemPrompt: string,
    userPrompt: string,
    context?: string
  ): Promise<string> {
    const contents = [];

    if (context) {
      contents.push({ text: `Context:\n${context}` });
    }

    contents.push({ text: systemPrompt });
    contents.push({ text: `User: ${userPrompt}` });

    return this.generateContent({ contents });
  }
}

// Singleton instance
let geminiServiceInstance: GeminiService | null = null;

export function getGeminiService(): GeminiService {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  if (!geminiServiceInstance) {
    geminiServiceInstance = new GeminiService(apiKey);
  }

  return geminiServiceInstance;
}
