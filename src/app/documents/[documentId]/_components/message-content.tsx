"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";

interface MessageContentProps {
  isAI?: boolean;
  text: string;
}

const MessageContent = ({ text, isAI = false }: MessageContentProps) => {
  if (!isAI) {
    return <span>{text}</span>;
  }

  return (
    <div className="prose prose-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MessageContent;
