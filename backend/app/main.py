from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import projects, alerts, upload, comparison, chat

app = FastAPI(
    title="SIH26103 Infrastructure Risk Monitor API",
    description="AI-powered predictive risk monitoring for centrally-sponsored infrastructure projects",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(alerts.router)
app.include_router(upload.router)
app.include_router(comparison.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "SIH26103 Risk Monitor API", "version": "1.0.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}
