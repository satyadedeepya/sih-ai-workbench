from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

"""
 PERSON 2: BACKEND API & INTEGRATION ENGINEER
 
 TODOs for main.py:
 1. Initialize the FastAPI app.
 2. Setup CORS so the React frontend can communicate with it.
 3. Mount the routers (from api/routes.py).
 4. Run using `uvicorn main:app --reload`
 """

app = FastAPI(title="Sovereign AI Workbench API")

# Configure CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to localhost / specific IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "Sovereign AI Workbench Backend is running locally. No internet connection required."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
