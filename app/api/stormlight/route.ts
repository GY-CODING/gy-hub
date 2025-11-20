import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt ?? "").trim();
    const topic = String(body?.topic ?? "handbook").trim();

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

    // Determinar qué archivo(s) leer según el tópico
    let fileContent = "";
    let contextLabel = "";

    switch (topic) {
      case "handbook":
        contextLabel = "Stormlight Archive RPG Handbook";
        const handbook1Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_HANDBOOK-1.md"
        );
        const handbook2Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_HANDBOOK-2.md"
        );
        const handbook3Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_HANDBOOK-3.md"
        );
        const handbook1 = fs.readFileSync(handbook1Path, "utf-8");
        const handbook2 = fs.readFileSync(handbook2Path, "utf-8");
        const handbook3 = fs.readFileSync(handbook3Path, "utf-8");
        fileContent = `${handbook1}\n\n---\n\n${handbook2}\n\n---\n\n${handbook3}`;
        break;

      case "world-guide":
        contextLabel = "Stormlight Archive RPG World Guide";
        const guide1Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_WORLD_GUIDE-1.md"
        );
        const guide2Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_WORLD_GUIDE-2.md"
        );
        const guide1 = fs.readFileSync(guide1Path, "utf-8");
        const guide2 = fs.readFileSync(guide2Path, "utf-8");
        fileContent = `${guide1}\n\n---\n\n${guide2}`;
        break;

      case "first-steps":
        contextLabel =
          "Stormlight Archive RPG - Handbook & World Guide (Complete)";
        const allHandbook1Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_HANDBOOK-1.md"
        );
        const allHandbook2Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_HANDBOOK-2.md"
        );
        const allHandbook3Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_HANDBOOK-3.md"
        );
        const allGuide1Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_WORLD_GUIDE-1.md"
        );
        const allGuide2Path = path.join(
          process.cwd(),
          "public/files/STORMLIGHT_RPG_WORLD_GUIDE-2.md"
        );
        const allHandbook1 = fs.readFileSync(allHandbook1Path, "utf-8");
        const allHandbook2 = fs.readFileSync(allHandbook2Path, "utf-8");
        const allHandbook3 = fs.readFileSync(allHandbook3Path, "utf-8");
        const allGuide1 = fs.readFileSync(allGuide1Path, "utf-8");
        const allGuide2 = fs.readFileSync(allGuide2Path, "utf-8");
        fileContent = `${allHandbook1}\n\n---\n\n${allHandbook2}\n\n---\n\n${allHandbook3}\n\n---\n\n${allGuide1}\n\n---\n\n${allGuide2}`;
        break;

      default:
        return NextResponse.json(
          { error: "Tópico no válido" },
          { status: 400 }
        );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { text: `Contexto (${contextLabel}):\n${fileContent}` },
        { text: `Pregunta del usuario: ${prompt}` },
      ],
    });
    const text = await response.text;
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Stormlight POST error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
