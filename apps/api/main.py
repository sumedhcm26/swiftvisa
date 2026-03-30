from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn

from routers import analyze, compare, routes, report, chat, ingest
from services.vector_store import VectorStore
from services.policy_loader import PolicyLoader

app = FastAPI(
    title="SwiftVisa API",
    description="AI-powered immigration intelligence platform",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/analyze", tags=["Analysis"])
app.include_router(compare.router, prefix="/api/compare", tags=["Compare"])
app.include_router(routes.router, prefix="/api/routes", tags=["Routes"])
app.include_router(report.router, prefix="/api/report", tags=["Report"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(ingest.router, prefix="/api/ingest", tags=["Ingest"])


@app.on_event("startup")
async def startup():
    print("🚀 SwiftVisa API starting up...")
    loader = PolicyLoader()
    loader.load_and_index()
    print("✅ Policy data loaded and indexed")


@app.get("/")
def root():
    return {"status": "ok", "message": "SwiftVisa API v2.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)