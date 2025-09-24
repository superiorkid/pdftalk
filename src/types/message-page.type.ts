import type { Message } from "@prisma/client";

export interface MessagesPage {
  data: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
  };
}
