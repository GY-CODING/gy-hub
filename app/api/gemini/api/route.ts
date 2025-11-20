import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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

    // Obtener documentación de APIs de MongoDB
    const client = await clientPromise;
    const db = client.db("APIGateway");
    const apiDocsCollection = db.collection("APIDocs");

    const apiDocs = await apiDocsCollection.find({}).limit(150).toArray();

    // Preparar contexto especializado para APIs
    let contextText = "=== DOCUMENTACIÓN DE APIs ===\n\n";

    if (apiDocs.length > 0) {
      contextText += "Catálogo de APIs disponibles:\n\n";
      contextText += apiDocs
        .map((doc, index) => {
          const docInfo = [];
          docInfo.push(`[API ${index + 1}]`);

          if (doc.name) docInfo.push(`Nombre: ${doc.name}`);
          if (doc.description) docInfo.push(`Descripción: ${doc.description}`);
          if (doc.version) docInfo.push(`Versión: ${doc.version}`);
          if (doc.baseUrl) docInfo.push(`Base URL: ${doc.baseUrl}`);

          if (doc.endpoints && Array.isArray(doc.endpoints)) {
            docInfo.push(`\nEndpoints (${doc.endpoints.length}):`);
            doc.endpoints
              .slice(0, 5)
              .forEach(
                (endpoint: {
                  method?: string;
                  path?: string;
                  url?: string;
                  description?: string;
                }) => {
                  docInfo.push(
                    `  • ${endpoint.method || "GET"} ${
                      endpoint.path || endpoint.url || ""
                    }`
                  );
                  if (endpoint.description)
                    docInfo.push(`    ${endpoint.description}`);
                }
              );
            if (doc.endpoints.length > 5) {
              docInfo.push(`  ... y ${doc.endpoints.length - 5} endpoints más`);
            }
          }

          if (doc.authentication) {
            docInfo.push(
              `\nAutenticación: ${JSON.stringify(doc.authentication)}`
            );
          }

          return docInfo.join("\n");
        })
        .join("\n\n" + "─".repeat(50) + "\n\n");
    } else {
      contextText += "No hay documentación de APIs disponible en este momento.";
    }

    const systemPrompt = `Eres un experto en documentación de APIs y arquitectura REST/GraphQL. Tu especialidad incluye:

- Explicar endpoints, métodos HTTP, parámetros, y respuestas
- Ayudar con autenticación (OAuth, JWT, API Keys)
- Mejores prácticas de diseño de APIs (RESTful, GraphQL)
- Debugging de llamadas API (errores HTTP, CORS, headers)
- Formatos de datos (JSON, XML, protobuf)
- Versionado de APIs y retrocompatibilidad
- Rate limiting, caching, y optimización

Usa la documentación proporcionada para responder sobre APIs específicas. Si el usuario pregunta sobre APIs generales, proporciona consejos expertos.

FORMATO DE RESPUESTAS:
- Usa bloques de código para ejemplos HTTP/curl/fetch
- Resalta métodos HTTP: **GET**, **POST**, **PUT**, **DELETE**, **PATCH**
- Estructura respuestas con secciones claras
- Incluye ejemplos de request/response cuando sea relevante`;

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `${systemPrompt}\n\n${contextText}\n\n### Pregunta del usuario:\n${prompt}\n\nRespuesta:`,
        },
      ],
    });

    const text = await response.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API POST error:", error);
    return NextResponse.json(
      { error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}
