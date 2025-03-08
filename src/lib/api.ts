
import { MessageType } from "./constants";

// Define the base URL for your Python backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Function to check if the backend is available
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/ping`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Short timeout for quick check
      signal: AbortSignal.timeout(2000)
    });
    return response.ok;
  } catch (error) {
    console.log("Backend not available:", error);
    return false;
  }
}

// Function to send a message to the Python backend
export async function sendMessageToBackend(
  content: string,
  apiKey?: string
): Promise<string> {
  try {
    // If we're in development mode with no backend, return a mock response
    const backendAvailable = await checkBackendStatus();
    if (!backendAvailable) {
      console.log("Using mock response for development");
      return "This is a mock response as the backend is not available. In production, this would come from your Python backend with LangChain and Google Gemini.";
    }
    
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
    // Check if backend is available
    const backendAvailable = await checkBackendStatus();
    if (!backendAvailable) {
      console.log("Using mock history for development");
      return [];
    }
    
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
    // Check if backend is available
    const backendAvailable = await checkBackendStatus();
    if (!backendAvailable) {
      console.log(`Mock file upload for ${type} in development mode`);
      // Simulate successful upload in development
      localStorage.setItem(`file_${type}`, file.name);
      return true;
    }
    
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
    // Check if backend is available
    const backendAvailable = await checkBackendStatus();
    if (!backendAvailable) {
      console.log("Mock CSV URL setting in development mode");
      localStorage.setItem("csv_url", url);
      return true;
    }
    
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
    // Check if backend is available
    const backendAvailable = await checkBackendStatus();
    if (!backendAvailable) {
      console.log("Using mock file status for development");
      // Check localStorage for mock uploads in development
      return {
        csv: !!localStorage.getItem("csv_url") || !!localStorage.getItem("file_csv"),
        privacy: !!localStorage.getItem("file_privacy"),
        terms: !!localStorage.getItem("file_terms"),
      };
    }
    
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
    // Return mock data in case of error
    return {
      csv: !!localStorage.getItem("csv_url") || !!localStorage.getItem("file_csv"),
      privacy: !!localStorage.getItem("file_privacy"),
      terms: !!localStorage.getItem("file_terms"),
    };
  }
}
