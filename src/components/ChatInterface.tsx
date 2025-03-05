
import React, { useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "./ChatHeader";
import MessageBubble, { TypingIndicator } from "./MessageBubble";
import ChatInput from "./ChatInput";
import QuickReply from "./QuickReply";
import WelcomeScreen from "./WelcomeScreen";
import AnimatedTransition from "./AnimatedTransition";

const ChatInterface: React.FC = () => {
  const { messages, isTyping, sendMessage, showWelcome, setShowWelcome } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleQuickReplySelect = (reply: string) => {
    sendMessage(reply);
  };

  const handleStartChat = () => {
    setShowWelcome(false);
  };

  return (
    <div className="chatbot-container">
      {showWelcome ? (
        <WelcomeScreen onStartChat={handleStartChat} />
      ) : (
        <AnimatedTransition show={true} animation="fade" className="h-full flex flex-col">
          <ChatHeader />
          
          <div className="message-list">
            {messages.map((message, index) => (
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
          
          <div className="message-input-container">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default ChatInterface;
