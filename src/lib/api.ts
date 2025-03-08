
import { MessageType } from "./constants";

// Define the base URL for your Python backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Function to send a message to the Python backend
export async function sendMessageToBackend(
  content: string,
  apiKey?: string
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        message: content,
        api_key: apiKey || localStorage.getItem("gemini_api_key") || ""
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Error communicating with backend:", error);
    return "Sorry, there was an error connecting to the assistant. Please try again later.";
  }
}

// Function to get conversation history from the backend
export async function getConversationHistory(): Promise<MessageType[]> {
  try {
    const response = await fetch(`${API_URL}/history`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    return [];
  }
}

// Function to upload files to the backend
export async function uploadFile(
  file: File, 
  type: "csv" | "privacy" | "terms"
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error(`Error uploading ${type} file:`, error);
    return false;
  }
}

// Function to set CSV URL
export async function setCSVUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/set-csv-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error("Error setting CSV URL:", error);
    return false;
  }
}

// Function to check if all required files are uploaded
export async function checkFilesStatus(): Promise<{
  csv: boolean;
  privacy: boolean;
  terms: boolean;
}> {
  try {
    const response = await fetch(`${API_URL}/files-status`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      csv: data.csv || false,
      privacy: data.privacy || false,
      terms: data.terms || false,
    };
  } catch (error) {
    console.error("Error checking files status:", error);
    return {
      csv: false,
      privacy: false,
      terms: false,
    };
  }
}
