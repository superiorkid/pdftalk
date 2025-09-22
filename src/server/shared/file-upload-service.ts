import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "text/plain": "txt",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
  };
  return mimeToExt[mimeType] || "bin";
}

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

export async function deleteFile(filePath?: string | null) {
  if (filePath) {
    try {
      await unlink(join(process.cwd(), "uploads", filePath));
    } catch (error) {
      // ignore
    }
  }
}
