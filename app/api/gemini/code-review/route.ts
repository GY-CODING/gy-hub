import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Organización de GitHub para buscar código
const GITHUB_OWNER = "GY-CODING";

// Helper para listar repositorios de la organización
async function listOrgRepos() {
  try {
    const apiUrl = `https://api.github.com/orgs/${GITHUB_OWNER}/repos?per_page=100`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      return { error: `Error listando repos: ${response.statusText}` };
    }

    const repos = await response.json();
    return {
      repos: repos.map(
        (repo: {
          name: string;
          description: string;
          html_url: string;
          language: string;
        }) => ({
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
        })
      ),
    };
  } catch (error) {
    return { error: `Error al listar repos: ${error}` };
  }
}

// Helper para obtener contenido de un archivo desde GitHub
async function fetchFileContent(repo: string, path: string) {
  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      return { error: `No se pudo obtener: ${response.statusText}` };
    }

    const data = await response.json();

    // El contenido viene en base64
    if (data.content) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return { content, path: data.path, url: data.html_url };
    }

    return { error: "No se encontró contenido" };
  } catch (error) {
    return { error: `Error al obtener archivo: ${error}` };
  }
}

// Helper para listar archivos del repositorio
async function listRepoFiles(repo: string, path: string = "") {
  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      return { error: `Error listando archivos: ${response.statusText}` };
    }

    const data = await response.json();
    return { files: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { error: `Error al listar: ${error}` };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt ?? "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta la variable de entorno GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    // Buscar en los repositorios de la organización GY-CODING
    let codeContext = `\n\n=== ORGANIZACIÓN: ${GITHUB_OWNER} ===\n\n`;

    // Detectar si el usuario especifica un repo y archivo
    const repoFileMatch = prompt.match(
      /(?:repo|repositorio):\s*([^\s,]+)(?:\s+(?:archivo|file|path|ruta):\s*([^\s,]+))?/i
    );

    if (repoFileMatch) {
      const repoName = repoFileMatch[1];
      const filePath = repoFileMatch[2];

      if (filePath) {
        // Usuario especificó repo y archivo
        const result = await fetchFileContent(repoName, filePath);

        if ("content" in result) {
          codeContext += `**Repositorio:** ${repoName}\n**Archivo:** ${result.path}\n**URL:** ${result.url}\n\n\`\`\`\n${result.content}\n\`\`\`\n\n`;
        } else if ("error" in result) {
          codeContext += `**Error:** ${result.error}\n\n`;
        }
      } else {
        // Solo especificó repo, listar archivos
        const repoStructure = await listRepoFiles(repoName);

        if ("files" in repoStructure && repoStructure.files.length > 0) {
          codeContext += `**Repositorio:** ${repoName}\n**Estructura:**\n\n`;
          repoStructure.files
            .slice(0, 30)
            .forEach((file: { name: string; type: string; path: string }) => {
              const icon = file.type === "dir" ? "📁" : "📄";
              codeContext += `${icon} ${file.name}\n`;
            });

          if (repoStructure.files.length > 30) {
            codeContext += `\n... y ${
              repoStructure.files.length - 30
            } archivos más\n`;
          }

          codeContext +=
            "\n💡 **Tip:** Usa 'repo: nombre-repo archivo: ruta/archivo' para ver contenido.\n";
        } else if ("error" in repoStructure) {
          codeContext += `**Error:** ${repoStructure.error}\n\n`;
        }
      }
    } else {
      // Listar todos los repositorios de la organización
      const orgRepos = await listOrgRepos();

      if ("repos" in orgRepos && orgRepos.repos.length > 0) {
        codeContext += "**Repositorios de la organización:**\n\n";
        orgRepos.repos.forEach(
          (repo: {
            name: string;
            description: string;
            language: string;
            url: string;
          }) => {
            codeContext += `📦 **${repo.name}**`;
            if (repo.language) codeContext += ` (${repo.language})`;
            if (repo.description) codeContext += `\n   ${repo.description}`;
            codeContext += `\n   🔗 ${repo.url}\n\n`;
          }
        );

        codeContext += "\n💡 **Tips:**\n";
        codeContext += "- Usa 'repo: nombre-repo' para ver estructura\n";
        codeContext +=
          "- Usa 'repo: nombre-repo archivo: ruta/archivo' para ver código\n";
      } else if ("error" in orgRepos) {
        codeContext += `**Error:** ${orgRepos.error}\n\n`;
      }
    }

    const systemPrompt = `Eres un experto revisor de código de la organización ${GITHUB_OWNER}.

**ORGANIZACIÓN:**
- Nombre: ${GITHUB_OWNER}
- URL: https://github.com/${GITHUB_OWNER}
- Acceso: Todos los repositorios públicos

**TU FUNCIÓN:**
Analizar y proporcionar información sobre el código y estructura de los repositorios de la organización.

**CAPACIDADES:**
1. Listar todos los repositorios de la organización
2. Explorar estructura de repositorios específicos
3. Revisar código de archivos específicos
4. Sugerir mejoras y optimizaciones
5. Identificar patrones entre proyectos
6. Ayudar a entender la arquitectura de los proyectos

**FORMATO DE RESPUESTAS:**
- 📦 **Repositorios:** Lista de proyectos disponibles
- 📁 **Estructura:** Organización de carpetas y archivos
- 💻 **Código:** Análisis de código específico cuando se proporcione
- ✅ **Buenas prácticas:** Lo que está bien implementado
- ⚠️ **Sugerencias:** Mejoras potenciales
- 🔍 **Observaciones:** Patrones y detalles importantes

Sé específico y referencia los repositorios y archivos cuando sea relevante.`;

    const ai = new GoogleGenAI({ apiKey });

    const fullPrompt = `${systemPrompt}${codeContext}\n\n### Pregunta del usuario:\n${prompt}\n\nRespuesta:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: fullPrompt,
        },
      ],
    });

    const text = await response.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini Code Review POST error:", error);
    return NextResponse.json(
      { error: "Error procesando la revisión de código" },
      { status: 500 }
    );
  }
}
