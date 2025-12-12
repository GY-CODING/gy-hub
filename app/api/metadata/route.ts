import { NextRequest, NextResponse } from "next/server";
import { metadataService } from "./service";

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

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "Falta la variable de entorno MONGODB_URI" },
        { status: 500 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Falta la variable de entorno GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const text = await metadataService.generateResponse(prompt);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Metadata API error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { ok: false, error: "Falta la variable de entorno MONGODB_URI" },
        { status: 500 }
      );
    }

    const { getMongoDBService } = await import(
      "../assistants/shared/services/mongodb.service"
    );
    const mongodb = getMongoDBService();
    const db = await mongodb.getDatabase("GYAccounts");
    const collection = db.collection("Metadata");
    const data = await collection.find({}).limit(200).toArray();

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching data from MongoDB" },
      { status: 500 }
    );
  }
}
