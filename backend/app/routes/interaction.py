from fastapi import APIRouter
from app.schemas.interaction_schema import DrugInteractionRequest, DrugInteractionResponse
from app.services.gemini_client import fetch_drug_interactions

router = APIRouter()

@router.post("/interactions", response_model=DrugInteractionResponse)
async def check_drug_interactions(request: DrugInteractionRequest):
    result = fetch_drug_interactions(request.drugs)
    return result
