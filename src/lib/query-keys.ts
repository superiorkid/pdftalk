export const documentKeys = {
  all: ["documents"] as const,
  findById: (documentId: string) => [...documentKeys.all, { documentId }],
};

export const categoryKeys = {
  all: ["categories"] as const,
};
