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

    // Obtener datos de MongoDB - Base de datos APIGateway, colección APIDocs
    const client = await clientPromise;
    const db = client.db("APIGateway");
    const apiDocsCollection = db.collection("APIDocs");

    const apiDocs = await apiDocsCollection.find({}).limit(100).toArray();

    // Preparar contexto con los datos de la API
    let contextText = "Contexto de documentación de APIs disponibles:\n\n";

    if (apiDocs.length > 0) {
      contextText += apiDocs
        .map((doc, index) => {
          return `API ${index + 1}:\n${JSON.stringify(doc, null, 2)}`;
        })
        .join("\n\n");
    } else {
      contextText += "No hay documentación de APIs disponible en este momento.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `${contextText}\n\nPregunta del usuario: ${prompt}\n\nPor favor, responde usando la información de las APIs documentadas arriba cuando sea relevante.`,
        },
      ],
    });

    const text = await response.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini POST error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
