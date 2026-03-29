from fastapi import APIRouter
from services.policy_loader import PolicyLoader

router = APIRouter()


@router.post("/reload")
async def reload_policies():
    loader = PolicyLoader()
    policies = loader.load_and_index()
    return {"success": True, "message": f"Reloaded {len(policies)} policies"}