from fastapi import APIRouter, HTTPException
from app.schemas.prediction_schema import SymptomsRequest, DiseaseInfoResponse
from app.models.predictor import DiseasePredictor
from app.utils.data_maps import (
    description_map, diet_map, med_map, precautions_map, workout_map
)
from app.services.gemini_client import fetch_gemini_info

router = APIRouter()

predictor = DiseasePredictor()

@router.post("/predict", response_model=DiseaseInfoResponse)
async def predict_disease(info: SymptomsRequest):
    disease = predictor.predict(info.symptoms)

    gemini_info = fetch_gemini_info(disease)  # ✅ This line is essential
    print("Gemini Info:", gemini_info)        # ✅ Debug print

    return DiseaseInfoResponse(
    Disease=disease,
    Overview=description_map.get(disease, "Not available"),
    Diet=diet_map.get(disease, "Not available"),
    Medication=med_map.get(disease, "Not available"),
    Precautions=precautions_map.get(disease, []),
    Workout=workout_map.get(disease, "Not available"),
    Dosage=gemini_info.get("Dosage"),
    Side_Effects=gemini_info.get("Side_Effects"),
    Warnings=gemini_info.get("Warnings"),
    Interactions=gemini_info.get("Interactions"),  # <-- ADD THIS
)

