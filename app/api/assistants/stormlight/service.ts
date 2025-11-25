import { getFileLoader } from "../shared/services/file-loader.service";
import { getGeminiService } from "../shared/services/gemini.service";
import { STORMLIGHT_FILE_PATHS, STORMLIGHT_SYSTEM_PROMPT } from "./constants";

export class StormlightService {
  private gemini = getGeminiService();
  private fileLoader = getFileLoader();

  async generateResponse(prompt: string, topic?: string): Promise<string> {
    const context = this.loadGameContext(topic);

    return this.gemini.generateWithContext(
      STORMLIGHT_SYSTEM_PROMPT,
      prompt,
      context
    );
  }

  private loadGameContext(topic?: string): string {
    // Cargar solo los archivos relevantes según el topic
    switch (topic) {
      case "handbook":
        // Solo reglas del juego
        const handbookContent = this.fileLoader.loadMultipleFiles(
          STORMLIGHT_FILE_PATHS.HANDBOOK
        );
        return `# Stormlight Archive RPG - Reglas del Juego\n\n${handbookContent}`;

      case "world-guide":
        // Solo información del mundo
        const worldGuideContent = this.fileLoader.loadMultipleFiles(
          STORMLIGHT_FILE_PATHS.WORLD_GUIDE
        );
        return `# Stormlight Archive RPG - Guía del Mundo\n\n${worldGuideContent}`;

      case "first-steps":
        // Para primeros pasos, solo el primer archivo del handbook
        const firstStepsContent = this.fileLoader.loadFile(
          STORMLIGHT_FILE_PATHS.HANDBOOK[0]
        );
        return `# Stormlight Archive RPG - Primeros Pasos\n\n${firstStepsContent}`;

      default:
        // Si no hay topic, cargar un resumen o el primer archivo
        const defaultContent = this.fileLoader.loadFile(
          STORMLIGHT_FILE_PATHS.HANDBOOK[0]
        );
        return `# Stormlight Archive RPG\n\nPor favor, selecciona un topic específico (Handbook, World Guide, o First Steps) para obtener información más detallada.\n\n${defaultContent}`;
    }
  }
}
