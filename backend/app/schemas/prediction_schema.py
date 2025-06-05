from pydantic import BaseModel
from typing import List

class SymptomsRequest(BaseModel):
    symptoms: List[str]

class DiseaseInfoResponse(BaseModel):
    Disease: str
    Overview: str
    Diet: str
    Medication: str
    Precautions: List[str]
    Workout: str
    Dosage: str
    Side_Effects: str
    Warnings: str
    Interactions: str  # <-- ADD THIS
