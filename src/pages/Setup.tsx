
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiKeyInput from "@/components/ApiKeyInput";
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { FileStatus } from "@/lib/constants";
import { checkFilesStatus } from "@/lib/api";

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
    <div className="flex-1 min-h-0 container max-w-2xl mx-auto py-8 px-4 sm:px-6 overflow-y-auto">
  <div className="space-y-8 pb-16">
        <h1 className="text-2xl font-bold text-center mb-6">AI Chat Setup</h1>
        
        <div className="space-y-6 max-w-md mx-auto">
          <ApiKeyInput onSaveComplete={navigateToChat} />
          
          <FileUploader onStatusChange={handleFileStatusChange} />
          
          {setupComplete && (
            <div className="flex justify-center pt-4 pb-8">
              <Button onClick={navigateToChat} size="lg">
                Go to Chat
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setup;
