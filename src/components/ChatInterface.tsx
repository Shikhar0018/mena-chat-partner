
import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "./ChatHeader";
import MessageBubble, { TypingIndicator } from "./MessageBubble";
import ChatInput from "./ChatInput";
import QuickReply from "./QuickReply";
import WelcomeScreen from "./WelcomeScreen";
import AnimatedTransition from "./AnimatedTransition";
import FileUploader from "./FileUploader";
import ApiKeyInput from "./ApiKeyInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileStatus } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const ChatInterface: React.FC = () => {
  const { 
    messages, 
    isTyping, 
    sendMessage, 
    showWelcome, 
    setShowWelcome,
    fileStatus,
    updateFileStatus,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [setupComplete, setSetupComplete] = useState<boolean>(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const isComplete = 
      fileStatus.csv && 
      fileStatus.privacy && 
      fileStatus.terms && 
      localStorage.getItem("gemini_api_key") !== null;
    
    setSetupComplete(isComplete);
    
    if (isComplete && activeTab === "setup") {
      setActiveTab("chat");
    }
  }, [fileStatus, activeTab]);

  const handleSendMessage = (content: string) => {
    if (!setupComplete) {
      setActiveTab("setup");
      return;
    }
    sendMessage(content);
  };

  const handleQuickReplySelect = (reply: string) => {
    if (!setupComplete) {
      setActiveTab("setup");
      return;
    }
    sendMessage(reply);
  };

  const handleStartChat = () => {
    setShowWelcome(false);
  };

  const handleFileStatusChange = (status: FileStatus) => {
    updateFileStatus(status);
  };

  const navigateToSetup = () => {
    setActiveTab("setup");
  };

  return (
    <div className="chatbot-container h-screen flex flex-col">
      {showWelcome ? (
        <WelcomeScreen onStartChat={handleStartChat} />
      ) : (
        <AnimatedTransition show={true} animation="fade" className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <ChatHeader />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={navigateToSetup}
              title="Go to Setup"
              aria-label="Go to Setup"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-2 mx-4 mt-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden">
              <div className="message-list scrollbar-thin flex-1 overflow-y-auto p-4">
                {!setupComplete && messages.length <= 1 && (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg mb-4 text-sm">
                    <p className="font-medium">Setup required</p>
                    <p>Please go to the Setup tab to upload required files and save your API key.</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    showAvatar 
                  />
                ))}
                
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
              
              {messages.length > 0 && !isTyping && (
                <QuickReply onSelect={handleQuickReplySelect} />
              )}
              
              <div className="message-input-container px-4 pb-4">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  disabled={!setupComplete}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="setup" className="tabs-setup-content flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                <ApiKeyInput />
                <FileUploader onStatusChange={handleFileStatusChange} />
              </div>
            </TabsContent>
          </Tabs>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default ChatInterface;
