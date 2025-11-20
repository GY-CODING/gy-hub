import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
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

    // Leer el archivo MD
    const filePath = path.join(
      process.cwd(),
      "public/files/heralds-of-chaos-story.md"
    );
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { text: `Contexto (Heralds of Chaos story):\n${fileContent}` },
        { text: `Pregunta del usuario: ${prompt}` },
      ],
    });
    const text = await response.text;
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Heralds POST error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
