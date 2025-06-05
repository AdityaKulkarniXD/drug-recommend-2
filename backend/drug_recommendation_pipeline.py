import os
import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from torch.utils.data import Dataset
import joblib
import evaluate

# Load datasets
df_train = pd.read_csv("data/Training.csv")
df_description = pd.read_csv("data/description.csv")
df_diets = pd.read_csv("data/diets.csv")
df_medications = pd.read_csv("data/medications.csv")
df_precautions = pd.read_csv("data/precautions_df.csv")
df_symptoms = pd.read_csv("data/symtoms_df.csv")
df_workout = pd.read_csv("data/workout_df.csv")

# Prepare data
columns_to_use = df_train.columns[:-1]
X = df_train[columns_to_use]
y = df_train['prognosis']

def vector_to_text(row):
    return " ".join([col.replace("_", " ") for col in columns_to_use if row[col] == 1])

df_train['text'] = X.apply(vector_to_text, axis=1)

unique_labels = y.unique()
label2id = {label: idx for idx, label in enumerate(unique_labels)}
id2label = {idx: label for label, idx in label2id.items()}
y_encoded = y.map(label2id)

X_train, X_test, y_train, y_test = train_test_split(df_train['text'], y_encoded, test_size=0.2, random_state=42)

tokenizer = AutoTokenizer.from_pretrained('emilyalsentzer/Bio_ClinicalBERT')
model = AutoModelForSequenceClassification.from_pretrained(
    'emilyalsentzer/Bio_ClinicalBERT',
    num_labels=len(label2id)
)

# Setup device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

class SymptomDataset(Dataset):
    def __init__(self, texts, labels):
        self.encodings = tokenizer(texts.tolist(), truncation=True, padding=True, max_length=512)
        self.labels = labels.tolist()

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

train_dataset = SymptomDataset(X_train, y_train)
test_dataset = SymptomDataset(X_test, y_test)

metric = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = torch.argmax(torch.tensor(logits), dim=1)
    return metric.compute(predictions=predictions, references=labels)

training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    logging_dir="./logs",
    per_device_train_batch_size=4,
    per_device_eval_batch_size=4,
    num_train_epochs=3,
    save_strategy="epoch"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics
)

trainer.train()

eval_results = trainer.evaluate()
print(f"\nModel Evaluation Accuracy: {eval_results['eval_accuracy']:.4f}\n")

if not os.path.exists("model"):
    os.makedirs("model")
model.save_pretrained("model/clinicalbert_model")
tokenizer.save_pretrained("model/clinicalbert_model")
joblib.dump(id2label, "model/id2label.pkl")

# Mapping dictionaries
description_map = dict(zip(df_description['Disease'], df_description['Description']))
diet_map = dict(zip(df_diets['Disease'], df_diets['Diet']))
med_map = dict(zip(df_medications['Disease'], df_medications['Medication']))
workout_map = dict(zip(df_workout['disease'], df_workout['workout']))

precautions_map = {}
for _, row in df_precautions.iterrows():
    disease = row['Disease']
    precautions_map[disease] = [
        row['Precaution_1'], row['Precaution_2'], row['Precaution_3'], row['Precaution_4']
    ]

def predict_disease_transformer(symptoms):
    text = " ".join([s.replace("_", " ") for s in symptoms])
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    # Move inputs to the same device as the model
    inputs = {k: v.to(device) for k, v in inputs.items()}
    model.eval()
    with torch.no_grad():
        outputs = model(**inputs)
        pred = torch.argmax(outputs.logits, dim=1).item()
    return id2label[pred]

def get_disease_info(symptoms):
    disease = predict_disease_transformer(symptoms)
    return {
        "Disease": disease,
        "Overview": description_map.get(disease, "Not available"),
        "Diet": diet_map.get(disease, "Not available"),
        "Medication": med_map.get(disease, "Not available"),
        "Precautions": precautions_map.get(disease, []),
        "Workout": workout_map.get(disease, "Not available"),
        "Dosage": "(To be fetched from external AI model)",
        "Side Effects": "(To be fetched from external AI model)",
        "Warnings": "(To be fetched from external AI model)"
    }

if __name__ == '__main__':
    symptoms_input = ["itching", "nodal_skin_eruptions", "dischromic_patches"]
    result = get_disease_info(symptoms_input)
    for key, value in result.items():
        print(f"{key}: {value}\n")
