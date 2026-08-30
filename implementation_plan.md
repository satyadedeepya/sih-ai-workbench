# Sovereign On-Premise Agentic AI Workbench - Implementation Plan

This project aims to build an air-gapped, on-premise AI workbench capable of multimodal tasks (text, OCR, coding) utilizing open-weight LLMs, equipped with local tool-calling (RAG, Sandbox, Document Generation), all while ensuring zero internet connectivity.

## User Review Required

> [!IMPORTANT]
> Please review the proposed architecture, technology stack, and team task division below. Once approved, I will automatically generate the skeleton codebase with detailed comments for each team member to kickstart their work.

## Open Questions

> [!WARNING]
> - Do you prefer **React** (Vite) or **Next.js** for the frontend framework? (Next.js is great for full-stack, but React + Vite is lightweight and easy to pair with FastAPI).
> - For the local model serving, is **Ollama** acceptable for the initial prototype, or do you require a more complex setup like **vLLM** right from the start?
> - Do you already have a GitHub repository initialized for this project in `d:\sih`, or should I create the folders directly in the root directory?

## Technology Stack

- **Frontend**: React (Vite) / TailwindCSS
- **Backend**: Python + FastAPI
- **LLM Server**: Ollama (for easy multi-model local execution)
- **Agent Framework**: LangChain / LlamaIndex (or custom Python routing)
- **RAG & Vector DB**: ChromaDB or FAISS
- **OCR**: Tesseract or EasyOCR
- **Sandbox**: Docker container executing Python code
- **Document Gen**: `python-docx`, `python-pptx`, `openpyxl`

## Team Task Division

### Person 1: Frontend & UI Developer
- **Focus**: AI Workbench UI, Chat Interface, File Uploads, Visualizing Agent Steps.
- **Key Files**: `/frontend/src/App.jsx`, `/frontend/src/components/Chat.jsx`, `/frontend/src/components/FileUploader.jsx`

### Person 2: Backend API & Integration Engineer
- **Focus**: FastAPI server, defining REST endpoints, session state, gluing modules together.
- **Key Files**: `/backend/main.py`, `/backend/api/routes.py`

### Person 3: AI Models & Model Router Engineer
- **Focus**: Ollama integration, loading models (e.g., Llama-3, Qwen-Coder), Task Classification, Model auto-routing.
- **Key Files**: `/backend/llm/router.py`, `/backend/llm/ollama_client.py`

### Person 4: Agent & Tools Engineer
- **Focus**: Agent planning loop, defining tools (read_file, create_docx, run_code), prompt engineering for planning.
- **Key Files**: `/backend/agent/planner.py`, `/backend/agent/tools.py`

### Person 5: RAG, OCR & Vision Specialist
- **Focus**: PDF extraction, running OCR on scanned docs, chunking, embeddings, local Vector DB.
- **Key Files**: `/backend/vision/ocr.py`, `/backend/rag/vector_store.py`

### Person 6: DevOps, Sandbox & Security Lead
- **Focus**: Dockerizing the entire stack, securing the coding sandbox, monitoring network to prove offline status.
- **Key Files**: `/docker-compose.yml`, `/sandbox/Dockerfile`, `/scripts/network_monitor.sh`

## Proposed Codebase Structure

Once approved, I will generate the following directory structure in `d:\sih` and populate these files with dummy/test code and extensive inline comments explaining exactly what each person needs to do.

```
sih-ai-workbench/
├── frontend/                     # Person 1
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx               # Main UI layout
│   │   ├── components/           # Chat, AgentStatus, FileUpload
│   │   └── api/                  # Axios calls to backend
├── backend/
│   ├── requirements.txt
│   ├── main.py                   # Person 2: FastAPI entry point
│   ├── api/
│   │   └── routes.py             # Person 2: API endpoints
│   ├── llm/
│   │   └── router.py             # Person 3: Task classifier & Ollama client
│   ├── agent/
│   │   ├── planner.py            # Person 4: Agent loop
│   │   └── tools.py              # Person 4: Local tool definitions
│   ├── vision/
│   │   └── ocr.py                # Person 5: EasyOCR/Tesseract integration
│   └── rag/
│       └── vector_store.py       # Person 5: Chroma/FAISS setup
├── sandbox/                      # Person 6: Isolated environment
│   └── Dockerfile
└── docker-compose.yml            # Person 6: Full offline deployment
```

## Verification Plan

### Automated/Manual Verification
- I will execute file structure commands and generate the template code.
- We will verify that the codebase is initialized without syntax errors.
- You can distribute the generated files to your team members so they can immediately see their TODOs in the comments.
