import { getGeminiService } from "../shared/services/gemini.service";
import { getMongoDBService } from "../shared/services/mongodb.service";
import {
  HERALDS_COLLECTION_NAME,
  HERALDS_DB_NAME,
  HERALDS_SYSTEM_PROMPT,
} from "./constants";
import { HeraldsStoryDocument } from "./types";

export class HeraldsService {
  private gemini = getGeminiService();
  private mongodb = getMongoDBService();

  async generateResponse(prompt: string): Promise<string> {
    const context = await this.loadStoryContext();

    return this.gemini.generateWithContext(
      HERALDS_SYSTEM_PROMPT,
      prompt,
      context
    );
  }

  private async loadStoryContext(): Promise<string> {
    try {
      const db = await this.mongodb.getDatabase(HERALDS_DB_NAME);
      const collection = db.collection<HeraldsStoryDocument>(
        HERALDS_COLLECTION_NAME
      );

      const documents = await collection.find({}).toArray();

      if (documents.length === 0) {
        return "No hay información disponible sobre Heralds of Chaos en este momento.";
      }

      const header = "# HISTORIA DE HERALDS OF CHAOS\n\n";
      const content = documents
        .map((doc) => `## ${doc.title || "Documento"}\n` + `${doc.content}\n`)
        .join("\n---\n\n");

      return header + content;
    } catch (error) {
      console.error("Error loading Heralds context from MongoDB:", error);
      return "Error al cargar la información de Heralds of Chaos.";
    }
  }
}

export const heraldsService = new HeraldsService();
