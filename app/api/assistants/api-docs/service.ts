import { getGeminiService } from "../shared/services/gemini.service";
import { getMongoDBService } from "../shared/services/mongodb.service";
import {
  API_DOCS_COLLECTION_NAME,
  API_DOCS_DB_NAME,
  API_DOCS_SYSTEM_PROMPT,
} from "./constants";
import { ApiDoc } from "./types";

export class ApiDocsService {
  private gemini = getGeminiService();
  private mongodb = getMongoDBService();

  async generateResponse(prompt: string): Promise<string> {
    const context = await this.loadApiDocsContext();

    return this.gemini.generateWithContext(
      API_DOCS_SYSTEM_PROMPT,
      prompt,
      context
    );
  }

  private async loadApiDocsContext(): Promise<string> {
    try {
      const db = await this.mongodb.getDatabase(API_DOCS_DB_NAME);
      const collection = db.collection<ApiDoc>(API_DOCS_COLLECTION_NAME);

      const apiDocs = await collection.find({}).limit(100).toArray();

      if (apiDocs.length === 0) {
        return "No hay documentación de APIs disponible en este momento.";
      }

      return apiDocs
        .map(
          (doc, index) => `API ${index + 1}:\n${JSON.stringify(doc, null, 2)}`
        )
        .join("\n\n");
    } catch (error) {
      console.error("Error loading API docs:", error);
      return "Error al cargar la documentación de APIs.";
    }
  }
}
