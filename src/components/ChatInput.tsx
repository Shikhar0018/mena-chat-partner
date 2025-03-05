
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2",
          "bg-chat-input shadow-sm border border-border",
          "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50"
        )}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className={cn(
            "flex-1 bg-transparent focus:outline-none",
            "text-sm placeholder:text-muted-foreground"
          )}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={cn(
            "flex items-center justify-center",
            "w-8 h-8 rounded-full",
            message.trim()
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
            "transform transition-all",
            message.trim() && "hover:scale-105 active:scale-95"
          )}
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
