"use client";

import DocumentCard from "./document-card";

const DocumentList = () => {
  return Array.from({ length: 8 }).map((_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: its for dummy data
    <DocumentCard key={index} />
  ));
};

export default DocumentList;
