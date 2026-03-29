from fastapi import APIRouter, HTTPException
from models.schemas import RouteRequest
from services.vector_store import vector_store
from services.llm_service import plan_migration_route

router = APIRouter()


@router.post("")
async def get_routes(request: RouteRequest):
    try:
        profile = request.profile
        policies = vector_store.get_policies_by_country(request.target_country)

        if not policies:
            query = f"work study immigration {request.target_country}"
            results = vector_store.hybrid_search(query=query, top_k=5)
            policies = [p for p, _ in results]

        result = plan_migration_route(
            profile.model_dump(), request.target_country, policies
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))