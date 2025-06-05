import transformers
print("Transformers version:", transformers.__version__)

from transformers import TrainingArguments

try:
    args = TrainingArguments(output_dir="test", evaluation_strategy="epoch")
    print("TrainingArguments supports evaluation_strategy.")
except TypeError as e:
    print("TypeError:", e)
