"use client";

import { Loader2Icon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "@/hooks/queries/message.query";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  containerStyle?: string;
  documentId: string;
}

const PromptInput = ({ containerStyle, documentId }: PromptInputProps) => {
  const [question, setQuestion] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: sendMessageMutation, isPending } = useSendMessage({
    documentId,
    onSuccess: () => {
      setQuestion("");
    },
  });

  const handleSubmit = () => {
    if (question.trim() && !isPending) {
      sendMessageMutation(question.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [question]);

  return (
    <div className={cn("w-full", containerStyle)}>
      <div className="flex gap-3 items-end">
        <Textarea
          ref={textareaRef}
          placeholder="Ask a question about your PDF..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!question.trim() || isPending}
          className="h-11 w-11 p-0 flex-shrink-0"
        >
          {isPending ? (
            <Loader2Icon className="h-5 w-5 animate-spin" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
          <span className="sr-only">Ask Question</span>
        </Button>
      </div>
      <p className="text-muted-foreground text-sm mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};
export default PromptInput;
