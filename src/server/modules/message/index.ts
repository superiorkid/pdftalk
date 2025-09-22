import { GoogleGenerativeAI } from "@google/generative-ai";
import { zValidator } from "@hono/zod-validator";
import { PineconeStore } from "@langchain/pinecone";
import type { Session, User } from "better-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod/v4";
import { pineconeIndex } from "@/server/lib/pinecone";
import { prisma } from "@/server/lib/prisma";
import embeddings from "@/server/lib/vector-embeddings";
import privateRoutesMiddleware from "@/server/middleware/private-route.middleware";
import getSafeNamespace from "@/server/utils/get-save-namespace";

const messageController = new Hono<{
  Variables: { user: User | null; session: Session | null };
}>()
  .use(privateRoutesMiddleware)
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        page: z.coerce.number().optional().default(1),
        limit: z.coerce.number().optional().default(10),
      }),
    ),
    async (ctx) => {
      const documentId = ctx.req.param("documentId");
      const { limit, page } = ctx.req.valid("query");

      const document = await prisma.document.findUnique({
        where: { id: documentId },
      });
      if (!document) {
        throw new HTTPException(404, { message: "Document not found" });
      }

      try {
        const [messages, total] = await Promise.all([
          prisma.message.findMany({
            where: { documentId },
            orderBy: { createdAt: "asc" },
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.message.count({
            where: { documentId },
          }),
        ]);

        const hasNextPage = page * limit < total;

        return ctx.json(
          {
            success: true,
            message: "Messages retrieved successfully",
            data: messages,
            pagination: {
              page,
              limit,
              total,
              hasNextPage,
            },
          },
          200,
        );
      } catch (error) {
        console.error(JSON.stringify(error));
        throw new HTTPException(500, { message: "Failed to get messages" });
      }
    },
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        question: z.string().min(1, { error: "Question is required" }),
      }),
    ),
    async (ctx) => {
      const documentId = ctx.req.param("documentId");
      const { question } = ctx.req.valid("json");

      if (!question || question.trim().length === 0) {
        throw new HTTPException(400, { message: "Question cannot be empty" });
      }

      const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
          messages: true,
        },
      });
      if (!document) {
        throw new HTTPException(404, { message: "Document not found." });
      }

      try {
        await prisma.message.create({
          data: {
            documentId: documentId as string,
            sender: "USER",
            content: question,
          },
        });

        const safeNamespace = getSafeNamespace(documentId as string);
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
          pineconeIndex,
          namespace: safeNamespace,
        });

        const results = await vectorStore.similaritySearch(question, 5);
        const contextText = results.map((r) => r.pageContent).join("\n\n");

        // ask gemini
        const genAI = new GoogleGenerativeAI(
          process.env.GOOGLE_API_KEY as string,
        );
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const conversationHistory = document.messages
          .map((message) => `${message.sender}: ${message.content}`)
          .join("\n");

        const prompt = `
          You are an AI assistant specialized in answering questions about a PDF document.
Always ground your answers ONLY in the provided context or conversation history.

## Guidelines
- ✅ Use Markdown for all answers:
  - Headings (##) for sections
  - Bullet points for lists
  - Tables if comparing data
  - Code blocks (triple backticks with language) for technical or programming content
- ✅ Be concise, accurate, and structured
- ✅ If multiple relevant parts exist, synthesize them into a clear explanation
- ⚠️ If the answer cannot be found in the context or conversation, respond with:
  "I could not find the answer in the provided document."
- ❌ Do not hallucinate or pull information from outside
- ⚖️ Adapt the style:
  - Programming → runnable code examples
  - Academic/economics → summarize key points
  - Legal/finance → preserve terminology exactly
- 🚫 Never mention "conversation history" or say things like "previously given answer". Just continue naturally.

---

### Context:
${contextText}

### Conversation (for reference only, do not mention explicitly):
${conversationHistory}

### Question:
${question}

### Your Answer (Markdown):
        `;

        const response = await model.generateContent(prompt);
        const answer = response.response.text();

        await prisma.message.create({
          data: {
            documentId: documentId as string,
            sender: "AI",
            content: answer,
          },
        });

        return ctx.json(
          {
            success: true,
            message: "Chat response generated",
          },
          201,
        );
      } catch (error) {
        console.error(JSON.stringify(error));
        throw new HTTPException(500, { message: "Failed to add question" });
      }
    },
  );

export default messageController;
