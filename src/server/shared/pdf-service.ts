import fs from "node:fs";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import pdf from "pdf-parse";
import { pineconeIndex } from "../lib/pinecone";
import embeddings from "../lib/vector-embeddings";
import getSafeNamespace from "../utils/get-save-namespace";

export async function ingestPDF(documentId: string, filePath: string) {
  try {
    console.log(`[ingestPDF] Starting ingestion for document ${documentId}`);

    const buffer = fs.readFileSync(filePath);
    const pdfData = await pdf(buffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      throw new Error("PDF has no extractable text");
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ".", " ", ""],
    });

    const docs = await splitter.createDocuments(
      [pdfData.text],
      [{ documentId }],
    );

    const safeNamespace = getSafeNamespace(documentId);

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: safeNamespace,
    });

    console.log(`[ingestPDF] Ingestion finished for document ${documentId}`);
  } catch (error) {
    console.error(`[ingestPDF] Error for document ${documentId}:`, error);
    throw error;
  }
}
