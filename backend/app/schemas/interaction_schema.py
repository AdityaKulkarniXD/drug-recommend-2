from pydantic import BaseModel
from typing import List

class DrugInteractionRequest(BaseModel):
    drugs: List[str]

class DrugInteractionItem(BaseModel):
    Drugs: str
    Level: str
    Description: str

class DrugInteractionResponse(BaseModel):
    Interactions: List[DrugInteractionItem]
