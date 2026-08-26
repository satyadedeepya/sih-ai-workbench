import React from 'react';
import Chat from './components/Chat';
import FileUploader from './components/FileUploader';

/**
 * PERSON 1: FRONTEND & UI DEVELOPER
 * 
 * TODOs for App.jsx:
 * 1. Build a modern layout that feels like an "AI Workbench" (not just a chat app).
 * 2. It should have a sidebar for active files/documents, and a main area for chat/agent execution.
 * 3. Include a "Model Selection" indicator to show which model is currently active (e.g. "Coding Model", "Vision Model").
 * 4. Display a network activity indicator proving that no external connections are being made.
 */
function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar for files and Agent status */}
      <aside className="w-1/4 p-4 border-r border-gray-700">
        <h1 className="text-xl font-bold mb-4">Sovereign AI Workbench</h1>
        
        {/* Person 1: Implement File uploader UI here */}
        <FileUploader />
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Agent Status</h2>
          {/* Person 1: Render agent steps here (e.g. "Reading PDF...", "Generating Word Doc...") */}
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 p-4">
        {/* Person 1: Implement the main chat interface here */}
        <Chat />
      </main>
    </div>
  );
}

export default App;
