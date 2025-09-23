"use client";

import type { Message } from "@prisma/client";
import { format } from "date-fns";
import { MessageSquareIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteMessages } from "@/hooks/queries/message.query";
import { cn } from "@/lib/utils";
import MessageContent from "./message-content";
import PromptInput from "./prompt-input";

interface PromptPageProps {
  documentId: string;
  limit: number;
}

const PromptPage = ({ documentId, limit }: PromptPageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { ref: topRef, inView: topInView } = useInView({
    root: containerRef.current ?? undefined,
    rootMargin: "0px",
    threshold: 0,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteMessages({ documentId, limit });

  const messages = useMemo(() => {
    if (!data) return [];

    return data.pages.reduce<Message[]>((acc, page, i) => {
      const normalized = page.data.map((msg) => ({
        ...msg,
        createdAt: new Date(msg.createdAt), // parse ISO string
        metadata:
          typeof msg.metadata === "string"
            ? JSON.parse(msg.metadata)
            : msg.metadata,
      }));

      if (i === 0) return [...normalized];
      return [...normalized, ...acc];
    }, []);
  }, [data]);

  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const fetchingOlderRef = useRef(false);

  useEffect(() => {
    if (!initialScrollDone && messages.length > 0 && containerRef.current) {
      requestAnimationFrame(() => {
        containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
        setInitialScrollDone(true);
      });
    } else if (
      !initialScrollDone &&
      status === "success" &&
      messages.length === 0
    ) {
      setInitialScrollDone(true);
    }
  }, [status, messages.length, initialScrollDone]);

  const fetchOlder = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || fetchingOlderRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    fetchingOlderRef.current = true;
    const prevHeight = container.scrollHeight;

    await fetchNextPage();

    requestAnimationFrame(() => {
      const newHeight = container.scrollHeight;
      container.scrollTop += newHeight - prevHeight; // maintain position
      fetchingOlderRef.current = false;
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (initialScrollDone && topInView) {
      fetchOlder();
    }
  }, [initialScrollDone, topInView, fetchOlder]);

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500 animate-pulse">
          Loading conversation…
        </p>
      </div>
    );
  }

  if (initialScrollDone && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl h-full max-w-4xl mx-auto">
        <div className="mb-4 rounded-full bg-gray-200 p-3">
          <MessageSquareIcon className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No messages yet
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Start a conversation by asking a question about your document.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-zinc-100 overflow-y-auto h-full" ref={containerRef}>
        <div className="flex flex-col space-y-3 p-4 overflow-y-auto rounded-2xl max-w-4xl mx-auto">
          <div ref={topRef} className="h-1" />

          {isFetchingNextPage && (
            <p className="text-center text-xs text-gray-500 py-2">
              Loading more messages...
            </p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex max-w-[75%] items-end",
                msg.sender === "USER"
                  ? "ml-auto justify-end"
                  : "mr-auto justify-start",
              )}
            >
              <div
                className={cn(
                  "px-4 py-2 rounded-2xl text-sm relative leading-relaxed",
                  msg.sender === "USER"
                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-br-sm"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm",
                )}
              >
                <MessageContent text={msg.content} isAI={msg.sender === "AI"} />
                <span
                  className={cn(
                    "absolute bottom-1 right-2 text-[10px] opacity-70",
                    msg.sender === "USER" ? "text-gray-200" : "text-gray-500",
                  )}
                >
                  {format(msg.createdAt, "HH:mm")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="py-5 border-t bg-background sticky bottom-0">
        <PromptInput
          containerStyle="max-w-4xl mx-auto space-y-1.5"
          documentId={documentId}
        />
      </footer>
    </>
  );
};

export default PromptPage;
