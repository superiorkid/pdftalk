import ChatHistory from "./chat-history";
import PromptInput from "./prompt-input";

const PromptPage = () => {
  return (
    <>
      <div className="bg-zinc-100 overflow-y-auto h-full">
        <ChatHistory containerStyle="max-w-4xl mx-auto" />
      </div>
      <footer className="py-5 border-t bg-background sticky bottom-0">
        <PromptInput containerStyle="max-w-4xl mx-auto space-y-1.5" />
      </footer>
    </>
  );
};

export default PromptPage;
