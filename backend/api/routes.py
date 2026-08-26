from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

/**
 * PERSON 2: BACKEND API & INTEGRATION ENGINEER
 * 
 * TODOs for routes.py:
 * 1. Create `/chat` endpoint: Receives user prompt -> Calls Person 3's Task Classifier -> Calls Person 4's Agent -> Returns result.
 * 2. Create `/upload` endpoint: Receives files -> Saves to local temp dir -> Triggers Person 5's OCR/RAG ingestion.
 * 3. Work closely with Person 3 and Person 4 to integrate their modules here.
 */

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    active_files: list[str] = []

@router.post("/chat")
async def chat_with_agent(req: ChatRequest):
    # TODO (Person 2): 
    # 1. from llm.router import classify_and_route
    # 2. model = classify_and_route(req.message)
    # 3. from agent.planner import run_agent
    # 4. result = run_agent(req.message, model, req.active_files)
    
    # Dummy response for now
    return {
        "status": "success",
        "response": "This is a dummy response from the agent.",
        "generated_files": []
    }

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # TODO (Person 2 & Person 5):
    # 1. Save file to disk securely
    # 2. If PDF/Image, trigger Person 5's OCR pipeline
    # 3. Add to Person 5's Vector DB (Chroma/FAISS)
    
    return {"filename": file.filename, "status": "Uploaded and ingested locally"}
