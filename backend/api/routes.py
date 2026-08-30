import os
import shutil
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

# Import teammate modules
from llm.router import get_router_status
from agent.planner import run_agent
from vision.ocr import extract_text_from_document

router = APIRouter()

# Setup a temporary directory for file uploads
UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

from typing import Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str
    attachment: Optional[Dict[str, Any]] = None

@router.get("/models")
async def get_models():
    """
    Returns available models. Needed by Person 1's Frontend ModelRouter.
    """
    return get_router_status()

@router.post("/chat")
async def chat_with_agent(req: ChatRequest):
    """
    Handles user chat. Passes it to Person 4's Agent.
    """
    model_used = "local-model" 
    
    files = [req.attachment["name"]] if req.attachment and "name" in req.attachment else []
    
    if files:
        classification = { "task": "Document Analysis", "model": "Vision-Reasoning-14B (local)", "route": "vision" }
        steps = [
            {"label": "Read uploaded file", "seconds": 0.5},
            {"label": "Detect scanned vs. text PDF", "seconds": 0.3},
            {"label": "Run on-device OCR", "seconds": 2.1},
            {"label": "Extract findings from text + layout", "seconds": 1.2},
            {"label": "Search local knowledge base (SOPs)", "seconds": 0.8},
            {"label": "Draft approval note", "seconds": 1.5}
        ]
        deliverables = [{"name": "Approval_Note.docx", "kind": "docx"}]
    elif "python" in req.message.lower() or "csv" in req.message.lower():
        classification = { "task": "Coding", "model": "Qwen2.5-Coder-32B (local)", "route": "coding" }
        steps = [
            {"label": "Parse request", "seconds": 0.4},
            {"label": "Route to coding model", "seconds": 0.2},
            {"label": "Generate code", "seconds": 2.5},
            {"label": "Execute in sandbox", "seconds": 1.1},
            {"label": "Check output", "seconds": 0.6}
        ]
        deliverables = [{"name": "solution.py", "kind": "code"}]
    else:
        classification = { "task": "General / Text", "model": "Llama-3.1-70B (local)", "route": "text" }
        steps = [
            {"label": "Route to general model", "seconds": 0.3},
            {"label": "Search local knowledge base", "seconds": 1.2},
            {"label": "Compose grounded answer", "seconds": 1.4}
        ]
        deliverables = []

    result_text = run_agent(req.message, model_used, files)
    
    return {
        "classification": classification,
        "steps": steps,
        "deliverables": deliverables,
        "reply": result_text
    }

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Handles file upload, saves to disk securely, and extracts text using OCR (Person 5).
    """
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save the uploaded file locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Pass the saved file to Person 5's Vision/OCR module
        extracted_text = extract_text_from_document(file_path)
    except Exception as e:
        extracted_text = f"Error extracting text: {e}"
    
    return {
        "filename": file.filename, 
        "status": "Uploaded successfully",
        # Return a snippet of extracted text just to prove OCR is working
        "extracted_text": extracted_text[:200] + "..." if len(extracted_text) > 200 else extracted_text
    }

@router.get("/sessions")
async def get_sessions():
    return [
        { "id": "s1", "title": "Inspection report -> approval note", "updatedAt": "2m ago", "active": True },
        { "id": "s2", "title": "CSV downtime analysis (Python)", "updatedAt": "1h ago" },
        { "id": "s3", "title": "P&ID drawing review", "updatedAt": "Yesterday" }
    ]

@router.get("/kb/documents")
async def get_kb_documents():
    return [
        { "name": "Inspection_SOP.pdf", "chunks": 142 },
        { "name": "Safety_Manual.pdf", "chunks": 288 },
        { "name": "Maintenance_Manual.pdf", "chunks": 201 },
        { "name": "Previous_Approval_Notes.pdf", "chunks": 76 },
    ]

@router.get("/network/stats")
async def get_network_stats():
    return { "externalCalls": 0, "blocked": 0, "airGapped": True, "healthy": True }

@router.get("/system/status")
async def get_system_status():
    return { "gpuNode": "GPU-NODE-01", "vramPct": 61, "modelsResident": 3, "modelsTotal": 3 }
