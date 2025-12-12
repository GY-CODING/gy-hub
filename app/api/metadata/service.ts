import { Db } from "mongodb";
import { getGeminiService } from "../assistants/shared/services/gemini.service";
import { getMongoDBService } from "../assistants/shared/services/mongodb.service";
import { METADATA_SYSTEM_PROMPT } from "./constants";
import { AccountMetadata, BookMetadata } from "./types";

export class MetadataService {
  private gemini = getGeminiService();
  private mongodb = getMongoDBService();

  async generateResponse(prompt: string): Promise<string> {
    // Extraer usernames del prompt
    const usernames = this.extractUsernames(prompt);
    console.log("[Metadata] Prompt recibido:", prompt);
    console.log("[Metadata] Posibles usernames extraídos:", usernames);

    // Si hay usernames, intentar buscar en la BD
    if (usernames.length > 0) {
      try {
        const db = await this.mongodb.getDatabase("GYAccounts");
        const result = await this.searchSpecificUsers(db, usernames);

        // Si encontró algo, devolverlo directamente
        if (result) {
          console.log(
            "[Metadata] ✓ Usuario encontrado, devolviendo resultado directo (sin Gemini)"
          );
          return result;
        }

        console.log(
          "[Metadata] ✗ No se encontró ningún usuario con esos nombres"
        );
      } catch (error) {
        console.error("Error searching specific users:", error);
      }
    }

    // Si no hay usernames o no se encontró nada, usar Gemini
    console.log("[Metadata] Usando Gemini para respuesta general");
    const context = await this.loadUserContext();

    console.log(
      "[Metadata] Contexto cargado (primeros 500 chars):",
      context.substring(0, 500)
    );
    console.log(
      "[Metadata] System prompt:",
      METADATA_SYSTEM_PROMPT.substring(0, 200)
    );

    return this.gemini.generateWithContext(
      METADATA_SYSTEM_PROMPT,
      prompt,
      context
    );
  }

  /**
   * Extrae posibles usernames del prompt (palabras que parecen nombres de usuario)
   */
  private extractUsernames(prompt: string): string[] {
    const usernames: string[] = [];

    // Extraer todas las palabras de 3+ caracteres alfanuméricos
    // Prioriza palabras en MAYÚSCULAS o CamelCase (típico de usernames)
    const words = prompt.match(/\b[a-zA-Z0-9_-]{3,}\b/g) || [];

    for (const word of words) {
      // Ignorar palabras comunes en español/inglés
      const commonWords = [
        "quien",
        "quién",
        "que",
        "sobre",
        "acerca",
        "información",
        "datos",
        "cuéntame",
        "dime",
        "usuario",
        "user",
        "username",
        "email",
        "the",
        "and",
        "por",
        "para",
        "con",
        "sin",
        "como",
        "son",
        "hay",
        "esta",
        "este",
        "favor",
        "dame",
        "muestra",
        "lista",
        "todos",
        "ver",
        "busca",
        "encuentra",
      ];

      if (!commonWords.includes(word.toLowerCase())) {
        usernames.push(word.toLowerCase());
      }
    }

    // Eliminar duplicados
    return [...new Set(usernames)];
  }

  /**
   * FASE 2: Busca usuarios específicos en MongoDB
   * Retorna null si no encuentra ningún usuario
   */
  private async searchSpecificUsers(
    db: Db,
    usernames: string[]
  ): Promise<string | null> {
    const results: string[] = [];

    for (const username of usernames) {
      try {
        // Buscar en GYAccounts.Metadata
        const accountsDb = await this.mongodb.getDatabase("GYAccounts");
        const accountsCollection =
          accountsDb.collection<AccountMetadata>("Metadata");
        const accountData = await accountsCollection.findOne({
          "profile.username": { $regex: new RegExp(username, "i") },
        });

        // Buscar en GYBooks.Metadata (si tenemos profileId del accountData)
        let bookData: BookMetadata | null = null;
        if (accountData?.profile?.id) {
          const booksDb = await this.mongodb.getDatabase("GYBooks");
          const booksCollection = booksDb.collection<BookMetadata>("Metadata");
          bookData = await booksCollection.findOne({
            profileId: accountData.profile.id,
          });
        }

        // Construir información del usuario SOLO si encontramos datos
        if (accountData || bookData) {
          let userInfo = "";

          // Header con imagen del usuario (formato especial para el frontend)
          if (accountData?.profile?.picture) {
            userInfo += `[USER_AVATAR:${accountData.profile.picture}]\n`;
          }

          userInfo += `# ${accountData?.profile?.username || username}\n\n`;

          if (accountData) {
            userInfo += `## 📋 Información de Cuenta\n\n`;
            userInfo += `- **Usuario:** ${accountData.profile.username}\n`;
            userInfo += `- **Email:** ${accountData.profile.email}\n`;
            userInfo += `- **Roles:** ${accountData.profile.roles.join(
              ", "
            )}\n`;
            if (accountData.profile.phoneNumber) {
              userInfo += `- **Teléfono:** ${accountData.profile.phoneNumber}\n`;
            }
            userInfo += `- **User ID:** \`${accountData.userId}\`\n`;
          }

          if (bookData) {
            if (bookData.biography) {
              userInfo += `\n## 📖 Biografía\n\n${bookData.biography}\n`;
            }

            if (bookData.hallOfFame) {
              userInfo += `\n## 🏆 Hall of Fame\n\n`;
              if (bookData.hallOfFame.quote) {
                userInfo += `> "${bookData.hallOfFame.quote}"\n\n`;
              }
              if (bookData.hallOfFame.books?.length) {
                userInfo += `**Libros favoritos:** ${
                  bookData.hallOfFame.books.length
                } libro${bookData.hallOfFame.books.length !== 1 ? "s" : ""}\n`;
              }
            }

            if (bookData.friends?.length) {
              userInfo += `\n## 👥 Red Social\n\n`;
              userInfo += `**Amigos:** ${bookData.friends.length} conexión${
                bookData.friends.length !== 1 ? "es" : ""
              }\n`;
            }

            if (bookData.activity?.length) {
              userInfo += `\n## 📊 Actividad Reciente\n\n`;
              const recentActivity = bookData.activity.slice(-5).reverse();
              recentActivity.forEach((act) => {
                const date = new Date(act.date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                userInfo += `- **${date}:** ${act.message}\n`;
              });
            }
          }

          results.push(userInfo);
        }
      } catch (error) {
        console.error(`Error searching for user ${username}:`, error);
      }
    }

    // Retornar null si no se encontró ningún usuario
    return results.length > 0 ? results.join("\n---\n\n") : null;
  }

  /**
   * Carga contexto de usuarios (solo para preguntas generales)
   */
  private async loadUserContext(): Promise<string> {
    try {
      // Cargar vista general
      return await this.loadGeneralContext();
    } catch (error) {
      console.error("Error loading user context:", error);
      return "Error al cargar información de usuarios.";
    }
  }

  /**
   * Carga contexto general cuando no se especifican usuarios
   */
  private async loadGeneralContext(): Promise<string> {
    try {
      const accountsDb = await this.mongodb.getDatabase("GYAccounts");
      const accountsCollection =
        accountsDb.collection<AccountMetadata>("Metadata");

      // Cargar solo algunos usuarios (5) para contexto general
      const accounts = await accountsCollection.find({}).limit(5).toArray();

      if (accounts.length === 0) {
        return "No hay usuarios disponibles en el sistema.";
      }

      const header = "# Usuarios de GYCODING (muestra)\n\n";
      const content = accounts
        .map(
          (acc) =>
            `**${acc.profile.username}** (${acc.profile.roles.join(", ")})\n` +
            `- Email: ${acc.profile.email}\n` +
            `- ID: ${acc.userId}\n`
        )
        .join("\n");

      return (
        header +
        content +
        "\n\n*Pregunta por un usuario específico para más detalles.*"
      );
    } catch (error) {
      console.error("Error loading general context:", error);
      return "Error al cargar contexto general.";
    }
  }
}

export const metadataService = new MetadataService();
