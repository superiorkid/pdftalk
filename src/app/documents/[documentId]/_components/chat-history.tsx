"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatHistoryProps {
  containerStyle?: string;
}

const messages = [
  {
    id: 1,
    sender: "human",
    text: "Hey!",
    timestamp: new Date("2025-09-17T09:00:00"),
  },
  {
    id: 2,
    sender: "ai",
    text: "Hello 👋 It’s nice to hear from you! I’m here to help with anything you need — whether that’s answering questions, sharing fun facts, or just having a casual chat. How’s your day going so far?",
    timestamp: new Date("2025-09-17T09:01:00"),
  },
  {
    id: 3,
    sender: "human",
    text: "Pretty good! Can you tell me something interesting?",
    timestamp: new Date("2025-09-17T09:02:00"),
  },
  {
    id: 4,
    sender: "ai",
    text: "Of course! Here’s a fun fact: octopuses actually have three hearts 🐙. Two hearts pump blood to the gills, while the third pumps it to the rest of the body. Even more fascinating, their blood is blue because it uses copper instead of iron to carry oxygen. Isn’t that wild?",
    timestamp: new Date("2025-09-17T09:03:00"),
  },
  {
    id: 5,
    sender: "human",
    text: "Whoa, that’s awesome!",
    timestamp: new Date("2025-09-17T09:04:00"),
  },
  {
    id: 6,
    sender: "ai",
    text: "I’m glad you think so! If you like, I can share more curious facts about animals, space, or even technology. A lot of people are surprised to learn, for example, that honey never spoils — archaeologists have found pots of honey in ancient Egyptian tombs that are still edible after thousands of years! 🍯",
    timestamp: new Date("2025-09-17T09:05:00"),
  },
  {
    id: 7,
    sender: "human",
    text: "Whoa, that’s awesome!",
    timestamp: new Date("2025-09-17T09:04:00"),
  },
];

const ChatHistory = ({ containerStyle }: ChatHistoryProps) => {
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
            msg.sender === "human"
              ? "ml-auto justify-end"
              : "mr-auto justify-start",
          )}
        >
          <div
            className={cn(
              "px-4 py-2 rounded-2xl text-sm relative leading-relaxed",
              msg.sender === "human"
                ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-br-sm"
                : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm",
            )}
          >
            <span className="leading-relaxed">{msg.text}</span>
            <span
              className={cn(
                "absolute bottom-1 right-2 text-[10px] opacity-70",
                msg.sender === "human" ? "text-gray-200" : "text-gray-500",
              )}
            >
              {format(msg.timestamp, "HH:mm")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
