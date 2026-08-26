import React, { useState } from 'react';
import { sendMessageToAgent } from '../api/client';

/**
 * PERSON 1: FRONTEND & UI DEVELOPER
 * 
 * TODOs for Chat.jsx:
 * 1. Handle user inputs and display the conversation history.
 * 2. When a user sends a message, call the backend API (see client.js).
 * 3. Render rich responses: if the agent outputs a file (like a .docx), render a download button.
 * 4. If the agent outputs code, render a formatted code block.
 */
export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    // 1. Add user message to UI
    // 2. Call sendMessageToAgent(input)
    // 3. Update UI with agent's response
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* Render messages here */}
      </div>
      
      <div className="mt-4 flex">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the agent to analyze a document or write code..."
          className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <button onClick={handleSend} className="ml-2 bg-blue-600 px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
