# backend/llm/dev_server.py
# Standalone dev server to test the /models endpoints in isolation,
# before Person 2 mounts api.py into the main backend app.

from fastapi import FastAPI

try:
    from .api import router_api
except ImportError:
    from api import router_api

app = FastAPI(title="Model Router - Dev Server")
app.include_router(router_api)

# Run with: uvicorn backend.llm.dev_server:app --reload --port 8001