import { createReadStream, existsSync, type Stats } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { getMimeType } from "hono/utils/mime";
import { uploadDocumentSchema } from "@/app/(homepage)/upload/upload-document-schema";
import { pineconeIndex } from "@/server/lib/pinecone";
import { prisma } from "@/server/lib/prisma";
import privateRoutesMiddleware from "@/server/middleware/private-route.middleware";
import { deleteFile, saveFile } from "@/server/shared/file-upload-service";
import { ingestPDF } from "@/server/shared/pdf-service";
import getSafeNamespace from "@/server/utils/get-save-namespace";

const UPLOAD_BASE_DIR = join(process.cwd(), "uploads");
const DOCUMENTS_DIR = join(UPLOAD_BASE_DIR, "documents");
const COVERS_DIR = join(UPLOAD_BASE_DIR, "covers");

async function ensureUploadDirs() {
  if (!existsSync(DOCUMENTS_DIR)) {
    await mkdir(DOCUMENTS_DIR, { recursive: true });
  }
  if (!existsSync(COVERS_DIR)) {
    await mkdir(COVERS_DIR, { recursive: true });
  }
}

const documentController = new Hono<{
  Variables: { user: User | null; session: Session | null };
}>()
  .get("/", privateRoutesMiddleware, async (ctx) => {
    const userId = ctx.get("user")?.id;

    try {
      const documents = await prisma.document.findMany({
        where: {
          authorId: userId,
        },
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return ctx.json(
        {
          success: true,
          message: "get documents successfully",
          data: documents,
        },
        200,
      );
    } catch (error) {
      console.error(JSON.stringify(error));
      throw new HTTPException(500, { message: "Failed to get documents" });
    }
  })
  .post(
    "/",
    privateRoutesMiddleware,
    zValidator("form", uploadDocumentSchema),
    async (ctx) => {
      const formData = ctx.req.valid("form");
      const userId = ctx.get("user")?.id;

      await ensureUploadDirs();

      try {
        const { category, file, title, cover, description, pageCount } =
          formData;

        const documentFileInfo = await saveFile(
          file,
          join(DOCUMENTS_DIR, userId as string),
        );

        let coverFileInfo: {
          filename: string;
          filePath: string;
          relativePath: string;
        } | null = null;
        if (cover) {
          coverFileInfo = await saveFile(
            cover,
            join(COVERS_DIR, userId as string),
          );
        }

        const document = await prisma.document.create({
          data: {
            title,
            pageCount: Number(pageCount),
            descrption: description as string,
            categoryId: category,
            coverPath: coverFileInfo?.relativePath,
            filePath: documentFileInfo.relativePath,
            status: "PROCESSING",
            fileSize: file.size,
            authorId: userId,
          },
        });

        (async () => {
          try {
            await ingestPDF(document.id, documentFileInfo.filePath); // use absolute
            await prisma.document.update({
              where: { id: document.id },
              data: { status: "READY" },
            });
          } catch (err) {
            console.error("Ingestion failed", err);
            await prisma.document.update({
              where: { id: document.id },
              data: { status: "FAILED" },
            });
          }
        })();

        return ctx.json(
          { message: "create documents successfully", success: true },
          201,
        );
      } catch (error) {
        console.error(JSON.stringify(error));
        throw new HTTPException(500, {
          message: "Failed to upload new document",
        });
      }
    },
  )
  .get("/:id", privateRoutesMiddleware, async (ctx) => {
    const documentId = ctx.req.param("id");
    const userId = ctx.get("user")?.id;

    try {
      const document = await prisma.document.findFirst({
        where: { AND: [{ id: documentId }, { authorId: userId }] },
        include: {
          category: true,
        },
      });
      if (!document)
        throw new HTTPException(404, { message: "Document not found" });

      return ctx.json(
        {
          message: "detail document",
          success: true,
          data: document,
        },
        200,
      );
    } catch (error) {
      console.error(JSON.stringify(error));

      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: "Failed to get detail document",
      });
    }
  })
  .delete("/:id", privateRoutesMiddleware, async (ctx) => {
    const userId = ctx.get("user")?.id;
    const documentId = ctx.req.param("id");

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || document.authorId !== userId) {
      throw new HTTPException(404, { message: "Document not found" });
    }

    try {
      const safeDocumentId = getSafeNamespace(documentId);
      await Promise.all([
        deleteFile(document.coverPath),
        deleteFile(document.filePath),
        pineconeIndex.deleteMany({ filter: { documentId: safeDocumentId } }),
        prisma.document.delete({ where: { id: documentId } }),
      ]);

      return ctx.json(
        {
          success: true,
          message: "Document deleted successfully",
        },
        200,
      );
    } catch (error) {
      console.error(JSON.stringify(error));
      throw new HTTPException(500, { message: "Failed to delete document" });
    }
  })
  .get("/:id/cover", async (ctx) => {
    const documentId = ctx.req.param("id");
    const userId = ctx.get("user")?.id;
    try {
      const document = await prisma.document.findFirst({
        where: { AND: [{ authorId: userId }, { id: documentId }] },
        select: {
          coverPath: true,
          authorId: true,
          status: true,
        },
      });

      if (!document) {
        throw new HTTPException(404, { message: "Document not found." });
      }

      if (!document.coverPath) {
        throw new HTTPException(404, { message: "No cover image available" });
      }

      const absolutePath = resolve(
        join(process.cwd(), "uploads", document.coverPath),
      );
      let stats: Stats | null = null;

      try {
        stats = await stat(absolutePath);
      } catch {
        throw new HTTPException(404, { message: "Cover file not found." });
      }

      const fileStream = createReadStream(absolutePath);

      ctx.header("Content-Type", getMimeType(document.coverPath));
      ctx.header("Content-Length", stats.size.toString());
      ctx.header("Cache-Control", "private, max-age=3600"); // private cache for 1 hour
      ctx.header("Content-Disposition", 'inline; filename="cover');

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return new Response(fileStream as any, { headers: ctx.res.headers });
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      console.error("Error serving cover image:", error);
      throw new HTTPException(500, { message: "Failed to serve cover image" });
    }
  });

export default documentController;
