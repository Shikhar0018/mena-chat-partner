
import { MessageType } from "./constants";

// Define the base URL for your Python backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Function to send a message to the Python backend
export async function sendMessageToBackend(content: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: content }),
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
