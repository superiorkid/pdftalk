export default function getSafeNamespace(documentId: string): string {
  const safeId = documentId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return safeId.substring(0, 63);
}
