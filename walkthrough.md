# SIH Project Codebase Walkthrough

I have successfully generated the foundational codebase for your **Sovereign On-Premise Agentic AI Workbench**. The files are heavily commented to guide each team member on their specific responsibilities.

## Directory Structure Overview

The project is structured in `d:\sih\sih-ai-workbench` as follows:

```
sih-ai-workbench/
├── docker-compose.yml        (Person 6)
├── frontend/                 (Person 1)
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── Chat.jsx
│       │   └── FileUploader.jsx
│       └── api/
│           └── client.js
├── backend/                  
│   ├── requirements.txt      (Person 2)
│   ├── main.py               (Person 2)
│   ├── api/
│   │   └── routes.py         (Person 2)
│   ├── llm/
│   │   ├── router.py         (Person 3)
│   │   └── ollama_client.py  (Person 3)
│   ├── agent/
│   │   ├── planner.py        (Person 4)
│   │   └── tools.py          (Person 4)
│   ├── vision/
│   │   └── ocr.py            (Person 5)
│   └── rag/
│       └── vector_store.py   (Person 5)
└── sandbox/                  (Person 6)
    └── Dockerfile
```

## Quick Start for the Team

1. **Person 1 (Frontend)**: Navigate to `d:\sih\sih-ai-workbench\frontend\src\` and review the components. Implement the chat UI and drag-and-drop file uploader.
2. **Person 2 (Backend Core)**: Start at `d:\sih\sih-ai-workbench\backend\main.py` and `routes.py`. These connect the React frontend to the AI logic.
3. **Person 3 (Models)**: Check `d:\sih\sih-ai-workbench\backend\llm\`. You need to integrate the local Ollama instance and build the model routing logic.
4. **Person 4 (Agent)**: Head to `d:\sih\sih-ai-workbench\backend\agent\`. The `planner.py` holds the core Agent Loop (Plan -> Act -> Observe).
5. **Person 5 (Vision & Knowledge)**: Open `d:\sih\sih-ai-workbench\backend\vision\` and `rag\`. You'll set up EasyOCR/Tesseract and local embeddings using Chroma/FAISS.
6. **Person 6 (DevOps & Security)**: Review `docker-compose.yml` and `sandbox\Dockerfile`. You must ensure the entire system runs isolated and verify that the `internal: true` flag in the network prevents external internet access.

> [!TIP]
> **Next Steps:** Have each team member review the `TODOs` in their respective files. The comments describe exactly what logic needs to be implemented to fulfill the SIH problem statement requirements.
