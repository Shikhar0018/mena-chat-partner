
import { useState, useCallback, useEffect } from "react";
import { MessageType, WELCOME_MESSAGES, FileStatus } from "@/lib/constants";
import { sendMessageToBackend, getConversationHistory, checkFilesStatus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [fileStatus, setFileStatus] = useState<FileStatus>({
    csv: false,
    privacy: false,
    terms: false,
  });
  const [apiKeySaved, setApiKeySaved] = useState(false);

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
      
      // Check if API key is saved
      const savedKey = localStorage.getItem("gemini_api_key");
      setApiKeySaved(!!savedKey);

      // Check file status
      checkRequiredFiles();
    }
  }, [messages.length]);
  
  // Function to check required files
  const checkRequiredFiles = async () => {
    try {
      const status = await checkFilesStatus();
      setFileStatus(status);
    } catch (error) {
      console.error("Failed to check file status:", error);
    }
  };
  
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

  // Function to update file status
  const updateFileStatus = useCallback((status: FileStatus) => {
    setFileStatus(status);
  }, []);

  // Function to send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Check if all required files are uploaded
    const allFilesUploaded = fileStatus.csv && fileStatus.privacy && fileStatus.terms;
    if (!allFilesUploaded) {
      toast({
        variant: "destructive",
        title: "Missing required files",
        description: "Please upload all required files before chatting.",
      });
      return;
    }

    // Check if API key is saved
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API key required",
        description: "Please save your Google Gemini API key first.",
      });
      return;
    }

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
      const botResponse = await sendMessageToBackend(content, apiKey);
      
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
  }, [fileStatus, toast]);

  return {
    messages,
    isTyping,
    sendMessage,
    showWelcome,
    setShowWelcome,
    isLoadingHistory,
    refreshHistory: fetchConversationHistory,
    fileStatus,
    updateFileStatus,
    apiKeySaved,
    checkRequiredFiles,
  };
}
