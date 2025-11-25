import { Db, MongoClient } from "mongodb";

export class MongoDBService {
  private client: MongoClient | null = null;
  private readonly uri: string;

  constructor(uri?: string) {
    this.uri = uri || process.env.MONGODB_URI || "";

    if (!this.uri) {
      throw new Error("MongoDB URI is required");
    }
  }

  async connect(): Promise<MongoClient> {
    if (this.client) {
      return this.client;
    }

    try {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error("Failed to connect to MongoDB");
    }
  }

  async getDatabase(dbName: string): Promise<Db> {
    const client = await this.connect();
    return client.db(dbName);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }
}

// Singleton instance
let mongoServiceInstance: MongoDBService | null = null;

export function getMongoDBService(): MongoDBService {
  if (!mongoServiceInstance) {
    mongoServiceInstance = new MongoDBService();
  }
  return mongoServiceInstance;
}
