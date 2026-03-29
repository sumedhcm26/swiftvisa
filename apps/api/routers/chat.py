from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest
from services.vector_store import vector_store
from services.llm_service import chat_followup

router = APIRouter()


@router.post("")
async def chat(request: ChatRequest):
    try:
        query = request.message
        if request.profile:
            p = request.profile
            query = f"{p.target_country} {p.goal} {query}"

        results = vector_store.hybrid_search(query=query, top_k=3)
        history = [{"role": m.role, "content": m.content} for m in request.history]
        reply = chat_followup(history, request.message, results)
        return {"success": True, "message": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))