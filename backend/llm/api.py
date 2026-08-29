# backend/llm/api.py

# from fastapi import APIRouter
# from pydantic import BaseModel
# from .router import route_and_generate, get_router_status
from fastapi import APIRouter
from pydantic import BaseModel

try:
    from .router import route_and_generate, get_router_status
except ImportError:
    from router import route_and_generate, get_router_status

router_api = APIRouter(prefix="/models", tags=["models"])


class RouteRequest(BaseModel):
    prompt: str
    file_info: dict | None = None
    task_type_override: str | None = None


@router_api.post("/route")
def route(request: RouteRequest):
    return route_and_generate(
        prompt=request.prompt,
        file_info=request.file_info,
        task_type_override=request.task_type_override,
    )


@router_api.get("")
def status():
    return get_router_status()