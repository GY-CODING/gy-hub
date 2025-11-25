import { GoogleGenAI } from "@google/genai";

export type GeminiModel = "gemini-2.5-flash" | "gemini-1.5-pro";

export interface GeminiGenerateOptions {
  model: GeminiModel;
  contents: Array<{ text: string }>;
}

export interface GeminiResponse {
  text: string | undefined;
}

export type GeminiClient = GoogleGenAI;
