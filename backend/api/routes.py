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

class ChatRequest(BaseModel):
    message: str
    active_files: list[str] = []

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
    # For now, default to local-model. Person 3's router can be integrated deeper here.
    model_used = "local-model" 
    
    # Pass the prompt and files to the Agent loop (Person 4)
    result_text = run_agent(req.message, model_used, req.active_files)
    
    return {
        "status": "success",
        "response": result_text,
        "generated_files": [] # Agent will populate this if it creates DOCX/XLSX
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
