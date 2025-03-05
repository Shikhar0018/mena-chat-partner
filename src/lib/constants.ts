
export const BOT_NAME = "Assistant";
export const BOT_AVATAR = "https://api.dicebear.com/7.x/bottts/svg?seed=Zoey";
export const USER_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

export const QUICK_REPLIES = [
  "What can you help me with?",
  "Find restaurants nearby",
  "Order food",
  "Track my order",
  "Help with payment issues",
  "Contact support"
];

export const WELCOME_MESSAGES = [
  "Hello! How can I assist you today?",
  "Hi there! I'm your virtual assistant. What can I help you with?",
  "Welcome! I'm here to make your experience better. How can I help?"
];

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export type QuickReplyType = string;
