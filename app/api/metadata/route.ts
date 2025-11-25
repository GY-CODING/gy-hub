import clientPromise from "@/lib/mongodb";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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
    const client = await clientPromise;
    // GYAccounts
    const dbAccounts = client.db("GYAccounts");
    const accountsMetadata = await dbAccounts
      .collection("Metadata")
      .find({})
      .limit(100)
      .toArray();
    const accountsAuthPicture = await dbAccounts
      .collection("AuthPicture")
      .find({})
      .limit(100)
      .toArray();
    // GYBooks
    const dbBooks = client.db("GYBooks");
    const booksBook = await dbBooks
      .collection("Book")
      .find({})
      .limit(100)
      .toArray();
    const booksBookPublic = await dbBooks
      .collection("BookPublic")
      .find({})
      .limit(100)
      .toArray();
    const booksFriendRequest = await dbBooks
      .collection("FriendRequest")
      .find({})
      .limit(100)
      .toArray();
    const booksMetadata = await dbBooks
      .collection("Metadata")
      .find({})
      .limit(100)
      .toArray();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta la variable de entorno GEMINI_API_KEY" },
        { status: 500 }
      );
    }
    const ai = new GoogleGenAI({ apiKey });
    // Construir contexto con todos los datos
    const contextText =
      `Datos de GYAccounts.Metadata:\n${JSON.stringify(accountsMetadata).slice(
        0,
        4000
      )}\n\n` +
      `Datos de GYAccounts.AuthPicture:\n${JSON.stringify(
        accountsAuthPicture
      ).slice(0, 4000)}\n\n` +
      `Datos de GYBooks.Book:\n${JSON.stringify(booksBook).slice(
        0,
        4000
      )}\n\n` +
      `Datos de GYBooks.BookPublic:\n${JSON.stringify(booksBookPublic).slice(
        0,
        4000
      )}\n\n` +
      `Datos de GYBooks.FriendRequest:\n${JSON.stringify(
        booksFriendRequest
      ).slice(0, 4000)}\n\n` +
      `Datos de GYBooks.Metadata:\n${JSON.stringify(booksMetadata).slice(
        0,
        4000
      )}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { text: `Contexto de varias bases de datos:\n${contextText}` },
        { text: `Pregunta del usuario: ${prompt}` },
      ],
    });
    const text = await response.text;
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Metadata POST error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
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
    const client = await clientPromise;
    const db = client.db("GYAccounts");
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
