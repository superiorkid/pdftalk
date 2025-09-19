import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getExtensionFromMimeType } from "../shared/file-upload-service";

const UPLOAD_BASE_DIR = join(process.cwd(), "uploads");

export async function saveFile(
  file: File,
  directory: string,
): Promise<{ filename: string; filePath: string; relativePath: string }> {
  const originalName = file.name;
  const fileExtension = originalName.includes(".")
    ? originalName.split(".").pop()
    : getExtensionFromMimeType(file.type);

  const safeFilename = `${randomUUID().replace(/\//g, "-")}.${fileExtension}`;
  const absolutePath = join(directory, safeFilename);
  const relativePath = absolutePath.replace(`${UPLOAD_BASE_DIR}/`, "");

  const dir = dirname(absolutePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await writeFile(absolutePath, buffer);

  return { filename: safeFilename, filePath: absolutePath, relativePath };
}
