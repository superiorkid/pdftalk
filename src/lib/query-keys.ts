export const documentKeys = {
  all: ["documents"] as const,
  allWithKeyword: (keyword: string) =>
    [...documentKeys.all, { keyword }] as const,
  findById: (documentId: string) =>
    [...documentKeys.all, { documentId }] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
};

export const messageKeys = {
  all: ["messages"] as const,
  allByDocumentId: (documentId: string) =>
    [...messageKeys.all, { documentId }] as const,
};
