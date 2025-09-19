import fs from "node:fs";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import pdf from "pdf-parse";

export async function ingestPDF(documentId: string, filePath: string) {
  console.log(`[ingestPDF] Starting ingestion for document ${documentId}`);

  const buffer = fs.readFileSync(filePath);
  const pdfData = await pdf(buffer);

  if (!pdfData.text || pdfData.text.trim().length === 0) {
    throw new Error("PDF has no extractable text");
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ["\n"],
  });
  const docs = await splitter.createDocuments([pdfData.text], [{ documentId }]);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  const indexName = process.env.PINECONE_INDEX_NAME as string;
  const index = pinecone.Index(indexName);

  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
    namespace: documentId,
  });

  console.log(`[ingestPDF] Ingestion finished for document ${documentId}`);
}
