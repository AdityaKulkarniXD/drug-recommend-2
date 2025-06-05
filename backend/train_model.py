# Install dependencies before running (run in terminal or notebook cell):
# pip install transformers scikit-learn torch pandas

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import torch
from torch.utils.data import Dataset
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification, Trainer, TrainingArguments

# --- GPU Check ---
print("CUDA available:", torch.cuda.is_available())
print("Device count:", torch.cuda.device_count())
if torch.cuda.is_available():
    print("Current device:", torch.cuda.current_device())
    print("Device name:", torch.cuda.get_device_name(torch.cuda.current_device()))
else:
    print("No GPU detected, running on CPU.")

# Load datasets
train_df = pd.read_csv("data/drugsComTrain_raw.csv")
test_df = pd.read_csv("data/drugsComTest_raw.csv")

# Drop nulls
train_df.dropna(subset=['condition', 'review'], inplace=True)
test_df.dropna(subset=['condition', 'review'], inplace=True)

# Label encoding
le = LabelEncoder()
train_df['label'] = le.fit_transform(train_df['condition'])
test_df = test_df[test_df['condition'].isin(le.classes_)]  # Filter unseen labels
test_df['label'] = le.transform(test_df['condition'])

# Tokenizer
tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

# Custom Dataset
class ReviewDataset(Dataset):
    def __init__(self, reviews, labels):
        self.encodings = tokenizer(reviews.tolist(), truncation=True, padding=True, max_length=512)
        self.labels = labels.tolist()

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

# Train/Val Split
train_texts, val_texts, train_labels, val_labels = train_test_split(
    train_df['review'], train_df['label'], test_size=0.1, random_state=42
)

train_dataset = ReviewDataset(train_texts, train_labels)
val_dataset = ReviewDataset(val_texts, val_labels)

# Model
model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased", num_labels=len(le.classes_)
)

# Training Args
training_args = TrainingArguments(
    output_dir="./results1",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=2,
    weight_decay=0.01,
    load_best_model_at_end=True,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)

# Train
trainer.train()

# Evaluate on Validation Set
preds_output = trainer.predict(val_dataset)
preds = np.argmax(preds_output.predictions, axis=1)
acc = accuracy_score(val_labels, preds)
print(f"\n🔍 Validation Accuracy: {acc:.4f}")
print("\nClassification Report (Validation):\n", classification_report(val_labels, preds, target_names=le.classes_, zero_division=0))

# Evaluate on Test Set
print("\n✅ Evaluating on Test Set...")
test_dataset = ReviewDataset(test_df['review'], test_df['label'])
test_preds_output = trainer.predict(test_dataset)
test_preds = np.argmax(test_preds_output.predictions, axis=1)
test_acc = accuracy_score(test_df['label'], test_preds)
print(f"\n🎯 Test Accuracy: {test_acc:.4f}")
print("\nClassification Report (Test):\n", classification_report(test_df['label'], test_preds, target_names=le.classes_, zero_division=0))

# BONUS: Recommend Top Drugs per Condition
def recommend_drugs(condition, top_n=5):
    subset = train_df[train_df['condition'] == condition]
    top_drugs = (
        subset.groupby('drugName')['rating']
        .mean()
        .sort_values(ascending=False)
        .head(top_n)
    )
    return top_drugs

# Example:
print("\n💊 Drug Recommendations for 'Depression':")
print(recommend_drugs('Depression'))
