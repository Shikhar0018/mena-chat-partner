
import { useState, useCallback, useEffect } from "react";
import { MessageType, WELCOME_MESSAGES } from "@/lib/constants";
import { sendMessageToBackend, getConversationHistory } from "@/lib/api";

export function useChat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Initialize with welcome message or fetch history
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
      
      // Try to fetch conversation history in the background
      fetchConversationHistory();
    }
  }, [messages.length]);
  
  // Function to fetch conversation history
  const fetchConversationHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const history = await getConversationHistory();
      
      if (history.length > 0) {
        setMessages(history);
      }
    } catch (error) {
      console.error("Failed to load conversation history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Function to send a message
  const sendMessage = useCallback(async (content: string) => {
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
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send message to the backend
      const botResponse = await sendMessageToBackend(content);
      
      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: botResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error getting response:", error);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Sorry, I'm having trouble connecting to my backend. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    showWelcome,
    setShowWelcome,
    isLoadingHistory,
    refreshHistory: fetchConversationHistory,
  };
}
