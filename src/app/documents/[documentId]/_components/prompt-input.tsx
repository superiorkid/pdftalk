import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  containerStyle?: string;
}

const PromptInput = ({ containerStyle }: PromptInputProps) => {
  return (
    <div className={cn("w-full", containerStyle)}>
      <div className="flex gap-4 items-end">
        <Textarea placeholder="Ask a question about your PDF..." />
        <Button size="lg">
          <SendIcon />
          <span className="sr-only">Ask Question</span>
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">
        Please Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};

export default PromptInput;
