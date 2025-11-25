import fs from "fs";
import path from "path";

export class FileLoaderService {
  private readonly baseDir: string;
  private cache: Map<string, string> = new Map();

  constructor(baseDir: string = "public/files") {
    this.baseDir = path.join(process.cwd(), baseDir);
  }

  loadFile(filename: string, useCache: boolean = true): string {
    if (useCache && this.cache.has(filename)) {
      return this.cache.get(filename)!;
    }

    try {
      const filePath = path.join(this.baseDir, filename);
      const content = fs.readFileSync(filePath, "utf-8");

      if (useCache) {
        this.cache.set(filename, content);
      }

      return content;
    } catch (error) {
      console.error(`Error loading file ${filename}:`, error);
      throw new Error(`Failed to load file: ${filename}`);
    }
  }

  loadMultipleFiles(
    filenames: readonly string[],
    useCache: boolean = true
  ): string {
    return filenames
      .map((filename) => this.loadFile(filename, useCache))
      .join("\n\n---\n\n");
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
let fileLoaderInstance: FileLoaderService | null = null;

export function getFileLoader(): FileLoaderService {
  if (!fileLoaderInstance) {
    fileLoaderInstance = new FileLoaderService();
  }
  return fileLoaderInstance;
}
