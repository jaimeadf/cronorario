import fs from "fs/promises";
import path from "path";

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf-8"));
}

export async function writeJsonFile<T>(
  filePath: string,
  data: T,
): Promise<void> {
  const dirPath = path.dirname(filePath);

  if (dirPath) {
    await ensureDirectoryExists(dirPath);
  }

  return await fs.writeFile(filePath, JSON.stringify(data));
}
