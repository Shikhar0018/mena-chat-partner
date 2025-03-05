
# Chatbot Backend Setup

This document explains how to set up and connect the Python backend for the chatbot application.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Clone this repository or create a new directory for your backend
2. Install required packages:

```bash
pip install langchain google-generativeai flask flask-cors
```

3. Create a file named `langchain_helper.py` with your LangChain and Google Palm setup

## Example Backend Code

Here's a simple example of what your `app.py` might look like:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import langchain_helper  # Import your LangChain helper module

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

conversation_history = []

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    # Add user message to history
    conversation_history.append({
        'id': str(len(conversation_history)),
        'content': user_message,
        'sender': 'user',
        'timestamp': datetime.now().isoformat()
    })
    
    # Get response from LangChain
    bot_response = langchain_helper.get_response(user_message, conversation_history)
    
    # Add bot response to history
    conversation_history.append({
        'id': str(len(conversation_history)),
        'content': bot_response,
        'sender': 'bot',
        'timestamp': datetime.now().isoformat()
    })
    
    return jsonify({'response': bot_response})

@app.route('/history', methods=['GET'])
def history():
    return jsonify({'history': conversation_history})

if __name__ == '__main__':
    app.run(debug=True)
```

## Configuration

Create a `.env` file in your backend directory with your Google API key:

```
GOOGLE_API_KEY=your_google_palm_api_key_here
```

## Running the Backend

Start the Flask server:

```bash
python app.py
```

The server will run on `http://localhost:5000` by default.

## Connecting to the Frontend

Make sure the frontend is configured to communicate with this backend by setting the environment variable `VITE_API_URL` to the backend URL.
