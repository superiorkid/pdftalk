"use client";

import { createContext, useContext, useState } from "react";

type ConversationPaginationContextType = {
  limit: number;
  page: number;
  setPage: (page: number) => void;
};

const ConversationPaginationContext = createContext<
  ConversationPaginationContextType | undefined
>(undefined);

type ConversationPaginationContextProviderType = {
  children: React.ReactNode;
  initialLimit?: number;
  initialPage?: number;
};

export const ConversationPaginationContextProvider = ({
  children,
  initialPage = 10,
  initialLimit = 1,
}: ConversationPaginationContextProviderType) => {
  const [page, setPage] = useState<number>(initialPage);
  const limit = initialLimit;

  const changePage = (newPage: number) => {
    if (newPage > 0) {
      setPage(newPage);
    }
  };

  return (
    <ConversationPaginationContext.Provider
      value={{ limit, page, setPage: changePage }}
    >
      {children}
    </ConversationPaginationContext.Provider>
  );
};

export const useConversationPagination = () => {
  const context = useContext(ConversationPaginationContext);
  if (!context) {
    throw new Error(
      "useConversationPagination must be used within a ConversationPaginationProvider",
    );
  }
  return context;
};
