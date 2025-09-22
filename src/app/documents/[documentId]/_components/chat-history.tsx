"use client";

import type { Message } from "@prisma/client";
import { format } from "date-fns";
import { MessageSquareIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import MessageContent from "./message-content";

interface ChatHistoryProps {
  containerStyle?: string;
  messages: Message[];
}

const ChatHistory = ({ containerStyle, messages }: ChatHistoryProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center rounded-2xl h-full",
          containerStyle,
        )}
      >
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
    <div
      className={cn(
        "flex flex-col space-y-3 p-4 overflow-y-auto rounded-2xl",
        containerStyle,
      )}
    >
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
  );
};
export default ChatHistory;
