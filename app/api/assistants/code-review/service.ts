import { getGeminiService } from "../shared/services/gemini.service";
import { CODE_REVIEW_SYSTEM_PROMPT, GITHUB_ORG } from "./constants";
import { GitHubRepository } from "./types";

export class CodeReviewService {
  private gemini = getGeminiService();
  private githubToken = process.env.GITHUB_TOKEN;

  async generateResponse(prompt: string): Promise<string> {
    const context = await this.loadGitHubContext();

    return this.gemini.generateWithContext(
      CODE_REVIEW_SYSTEM_PROMPT,
      prompt,
      context
    );
  }

  private async loadGitHubContext(): Promise<string> {
    if (!this.githubToken) {
      return "GitHub token no configurado. No se puede acceder a los repositorios.";
    }

    try {
      const response = await fetch(
        `https://api.github.com/orgs/${GITHUB_ORG}/repos`,
        {
          headers: {
            Authorization: `token ${this.githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        return `Error al obtener repositorios: ${response.statusText}`;
      }

      const repos: GitHubRepository[] = await response.json();

      return repos
        .map(
          (repo) =>
            `Repositorio: ${repo.name}\nDescripción: ${repo.description}\nLenguaje: ${repo.language}\nURL: ${repo.html_url}`
        )
        .join("\n\n");
    } catch (error) {
      console.error("Error loading GitHub context:", error);
      return "Error al cargar información de GitHub.";
    }
  }
}
