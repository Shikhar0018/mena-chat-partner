
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiKeyInput from "@/components/ApiKeyInput";
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { FileStatus } from "@/lib/constants";
import { checkFilesStatus } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const [setupComplete, setSetupComplete] = useState<boolean>(false);
  const [fileStatus, setFileStatus] = useState<FileStatus>({
    csv: false,
    privacy: false,
    terms: false,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await checkFilesStatus();
      setFileStatus(status);
    };
    
    fetchStatus();
  }, []);

  useEffect(() => {
    const isComplete = 
      fileStatus.csv && 
      fileStatus.privacy && 
      fileStatus.terms && 
      localStorage.getItem("gemini_api_key") !== null;
    
    setSetupComplete(isComplete);
  }, [fileStatus]);

  const handleFileStatusChange = (status: FileStatus) => {
    setFileStatus(prev => ({ ...prev, ...status }));
  };

  const navigateToChat = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 flex flex-col">
      <header className="border-b bg-white/50 backdrop-blur-sm py-4 px-6 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={navigateToChat} 
          className="flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Chat
        </Button>
        <h1 className="text-xl font-semibold mx-auto">AI Chat Setup</h1>
        <div className="w-24"></div>
      </header>
      
      <div className="flex-1 container max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">1. API Key Configuration</h2>
            <ApiKeyInput disableAutoNavigation={true} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium">2. Required Files</h2>
            <p className="text-sm text-muted-foreground">
              Upload the necessary files for your chatbot to function properly.
            </p>
            <FileUploader onStatusChange={handleFileStatusChange} />
          </div>
          
          {setupComplete && (
            <div className="mt-8 py-6 border-t border-muted">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="text-green-600 font-medium">
                  ✓ All requirements complete
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  Your chatbot is now ready to use. You can return to the chat to start interacting with it.
                </p>
                <Button onClick={navigateToChat} size="lg" className="mt-2">
                  Go to Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setup;
