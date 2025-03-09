
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Key } from "lucide-react";
import { Console } from "console";

const ApiKeyInput: React.FC = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  
  // Check if API key already exists in localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setSaved(true);
    }
  }, []);
  
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setSaved(true);
      toast({
        title: "API Key Saved",
        description: "Your Google Gemini API key has been saved.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Empty API Key",
        description: "Please enter a valid API key.",
      });
    }
  };


  
  const clearApiKey = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setSaved(false);
    toast({
      title: "API Key Removed",
      description: "Your Google Gemini API key has been removed.",
    });
  };
  
  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-2">
        <Key size={16} />
        <label htmlFor="api-key" className="text-sm font-medium">
          Google Gemini API Key
        </label>
      </div>
      
      <div className="flex gap-2">
        <Input
          type="password"
          id="api-key"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setSaved(false);
          }}
          placeholder="Enter your Google Gemini API key"
          className="flex-1"
        />
        {saved ? (
          <Button variant="outline" onClick={clearApiKey} size="sm">
            Clear
          </Button>
        ) : (
          <Button onClick = {saveApiKey} size="sm">
            Save
          </Button>
        )}
      </div>
      
      {saved ? (
        <div className="text-green-500 flex items-center text-xs">
          <CheckCircle size={12} className="mr-1" /> API key saved
        </div>
      ) : (
        <div className="text-amber-500 flex items-center text-xs">
          <AlertCircle size={12} className="mr-1" /> API key not saved
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;
