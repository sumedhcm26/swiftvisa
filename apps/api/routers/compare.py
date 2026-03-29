from fastapi import APIRouter, HTTPException
from models.schemas import CompareRequest
from services.vector_store import vector_store
from services.llm_service import compare_countries

router = APIRouter()


@router.post("")
async def compare(request: CompareRequest):
    try:
        profile = request.profile
        countries_policies = {}

        for country in request.countries:
            policies = vector_store.get_policies_by_country(country)
            if not policies:
                query = f"{profile.goal} visa {country} {profile.education_level} {profile.field_of_study}"
                results = vector_store.hybrid_search(query=query, top_k=3)
                policies = [p for p, _ in results if p.get("country", "").lower() == country.lower()]
            if policies:
                countries_policies[country] = policies

        if len(countries_policies) < 2:
            raise HTTPException(status_code=400, detail="Could not find policies for enough countries")

        result = compare_countries(profile.model_dump(), countries_policies)
        return {"success": True, "data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/countries")
async def get_countries():
    countries = vector_store.get_all_countries()
    return {"countries": countries}