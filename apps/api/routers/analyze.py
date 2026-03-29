from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeRequest
from services.vector_store import vector_store
from services.llm_service import analyze_eligibility

router = APIRouter()


@router.post("")
async def analyze(request: AnalyzeRequest):
    try:
        profile = request.profile
        query = (
            f"{profile.goal} visa for {profile.nationality} national "
            f"with {profile.education_level} in {profile.field_of_study}, "
            f"{profile.work_experience_years} years experience, "
            f"moving to {profile.target_country}"
        )

        results = vector_store.hybrid_search(
            query=query,
            top_k=5,
            country_filter=profile.target_country,
        )

        if not results:
            results = vector_store.hybrid_search(query=query, top_k=5)

        profile_dict = profile.model_dump()
        analysis = analyze_eligibility(profile_dict, results)

        top_policies = [p for p, _ in results]
        analysis["retrieved_policies"] = [
            {
                "id": p.get("id"),
                "country": p.get("country"),
                "visa_type": p.get("visa_type"),
                "category": p.get("category"),
                "processing_time_months": p.get("processing_time_months"),
                "cost_usd": p.get("cost_usd"),
                "tags": p.get("tags", []),
            }
            for p in top_policies
        ]

        return {"success": True, "data": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))