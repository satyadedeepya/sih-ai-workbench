/**
 * PERSON 1: FRONTEND & UI DEVELOPER
 * 
 * TODOs for client.js:
 * 1. Setup Axios to point to the FastAPI backend (e.g. http://localhost:8000).
 * 2. Implement the functions below to communicate with Person 2's API endpoints.
 */

const API_BASE = 'http://localhost:8000';

export async function sendMessageToAgent(message, activeFiles = []) {
  // TODO: Send POST /api/chat with message and active files
  // return response from agent
}

export async function uploadFile(file) {
  // TODO: Send POST /api/upload using multipart/form-data
  // return file reference/ID
}
