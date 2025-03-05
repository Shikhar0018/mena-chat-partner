
export const BOT_NAME = "Assistant";
export const BOT_AVATAR = "https://api.dicebear.com/7.x/bottts/svg?seed=Zoey";
export const USER_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

export const QUICK_REPLIES = [
  "What can you help me with?",
  "Tell me about your features",
  "How does this work?",
  "I need assistance"
];

export const WELCOME_MESSAGES = [
  "Hello! How can I assist you today?",
  "I'm here to help with any questions you might have."
];

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export type QuickReplyType = string;
