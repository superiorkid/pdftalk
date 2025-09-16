import { SendHorizonalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PdfChatPage = () => {
  return (
    <>
      <div className="bg-zinc-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-amber-500 h-full">
          <p>content here...</p>
        </div>
      </div>
      <footer className="py-5 border-t bg-background sticky bottom-0">
        <div className="max-w-4xl mx-auto space-y-1.5">
          <div className="flex gap-4 items-end">
            <Textarea placeholder="Ask a question about your PDF..." />
            <Button>
              <SendHorizonalIcon />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Please Enter to send, Shift+Enter for new line
          </p>
        </div>
      </footer>
    </>
  );
};

export default PdfChatPage;
