
import { useState, useCallback, useEffect } from "react";
import { MessageType, WELCOME_MESSAGES } from "@/lib/constants";

export function useChat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      // Random welcome message from the constants
      const welcomeMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
      
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            content: welcomeMessage,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }, 800);
    }
  }, [messages.length]);

  // Function to send a message
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    // Hide welcome screen when user sends first message
    setShowWelcome(false);
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response (would connect to a real backend in production)
    setTimeout(() => {
      const botResponse: MessageType = {
        id: Date.now().toString(),
        content: generateBotResponse(content),
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  }, []);

  // Simple mock response generation (replace with actual AI in production)
  const generateBotResponse = (message: string): string => {
    message = message.toLowerCase();
    
    if (message.includes("hello") || message.includes("hi")) {
      return "Hello! How can I assist you today?";
    } else if (message.includes("help") || message.includes("assist")) {
      return "I can help you find information, answer questions, or connect you with the right resources. What do you need help with?";
    } else if (message.includes("feature") || message.includes("do")) {
      return "I can answer questions, provide assistance, and help you navigate our services. Feel free to ask anything!";
    } else if (message.includes("how") && message.includes("work")) {
      return "Just type your questions or requests, and I'll do my best to assist you with relevant answers and solutions.";
    } else {
      return "I understand you're asking about that. Let me help you with more information or connect you with a human agent if needed.";
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    showWelcome,
    setShowWelcome,
  };
}
