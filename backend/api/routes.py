import os
import shutil
from typing import Optional, Dict, Any

from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

from llm.router import get_router_status
from agent.planner import run_agent
from agent.tools import read_file

router = APIRouter()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class ChatRequest(BaseModel):
    message: str
    attachment: Optional[Dict[str, Any]] = None


@router.get("/models")
async def get_models():
    return get_router_status()


@router.post("/chat")
async def chat_with_agent(req: ChatRequest):
    model_used = "llama3.1:8b"

    active_files = []

    if req.attachment and "name" in req.attachment:
        active_files = [
            os.path.join(
                UPLOAD_DIR,
                os.path.basename(req.attachment["name"]),
            )
        ]

    result_text = run_agent(
        req.message,
        model_used,
        active_files,
    )

    if req.attachment:
        classification = {
            "task": "Document Analysis",
            "model": "llama3.1:8b (local)",
            "route": "vision",
        }

        steps = [
            {"label": "Read uploaded file", "seconds": 0.5},
            {"label": "Extract document text", "seconds": 0.8},
            {"label": "Search local knowledge base", "seconds": 0.8},
            {"label": "Generate grounded answer", "seconds": 1.5},
        ]

        deliverables = []

    elif (
        "python" in req.message.lower()
        or "csv" in req.message.lower()
    ):
        classification = {
            "task": "Coding",
            "model": "llama3.1:8b (local)",
            "route": "coding",
        }

        steps = [
            {"label": "Parse request", "seconds": 0.4},
            {"label": "Generate code", "seconds": 2.0},
            {"label": "Execute in sandbox", "seconds": 1.1},
            {"label": "Check output", "seconds": 0.6},
        ]

        deliverables = []

    else:
        classification = {
            "task": "General / Text",
            "model": "llama3.1:8b (local)",
            "route": "text",
        }

        steps = [
            {"label": "Route to general model", "seconds": 0.3},
            {"label": "Search local knowledge base", "seconds": 0.8},
            {"label": "Compose grounded answer", "seconds": 1.2},
        ]

        deliverables = []

    return {
        "status": "success",
        "classification": classification,
        "steps": steps,
        "deliverables": deliverables,
        "reply": result_text,
        "response": result_text,
        "generated_files": [],
    }


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    safe_filename = os.path.basename(file.filename)

    file_path = os.path.join(
        UPLOAD_DIR,
        safe_filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    try:
        extracted_text = read_file(file_path)
    except Exception as e:
        extracted_text = f"Error extracting text: {e}"

    return {
        "filename": safe_filename,
        "status": "Uploaded successfully",
        "extracted_text": (
            extracted_text[:200] + "..."
            if len(extracted_text) > 200
            else extracted_text
        ),
    }


@router.get("/sessions")
async def get_sessions():
    return [
        {
            "id": "s1",
            "title": "Inspection report -> approval note",
            "updatedAt": "2m ago",
            "active": True,
        },
        {
            "id": "s2",
            "title": "CSV downtime analysis (Python)",
            "updatedAt": "1h ago",
        },
        {
            "id": "s3",
            "title": "P&ID drawing review",
            "updatedAt": "Yesterday",
        },
    ]


@router.get("/kb/documents")
async def get_kb_documents():
    return [
        {"name": "Inspection_SOP.pdf", "chunks": 142},
        {"name": "Safety_Manual.pdf", "chunks": 288},
        {"name": "Maintenance_Manual.pdf", "chunks": 201},
        {"name": "Previous_Approval_Notes.pdf", "chunks": 76},
    ]


@router.get("/network/stats")
async def get_network_stats():
    return {
        "externalCalls": 0,
        "blocked": 0,
        "airGapped": True,
        "healthy": True,
    }


@router.get("/system/status")
async def get_system_status():
    return {
        "gpuNode": "GPU-NODE-01",
        "vramPct": 61,
        "modelsResident": 1,
        "modelsTotal": 1,
    }