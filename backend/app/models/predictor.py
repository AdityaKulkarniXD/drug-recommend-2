import torch
import joblib
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_DIR = "model/clinicalbert_model"
ID2LABEL_PATH = "model/id2label.pkl"

class DiseasePredictor:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
        self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
        self.id2label = joblib.load(ID2LABEL_PATH)

    def predict(self, symptoms: list[str]) -> str:
        # Join symptoms into a single clinical text
        text = " ".join(symptom.replace("_", " ") for symptom in symptoms)
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            outputs = self.model(**inputs)
            prediction = torch.argmax(outputs.logits, dim=1).item()
        return self.id2label[prediction].strip()
