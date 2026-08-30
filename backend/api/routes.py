from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    active_files: list[str] = []

@router.post("/chat")
async def chat_with_agent(req: ChatRequest):
    return {
        "status": "success",
        "response": "This is a dummy response from the agent.",
        "generated_files": []
    }

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "status": "Uploaded and ingested locally"
    }
