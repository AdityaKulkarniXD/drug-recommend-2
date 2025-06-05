import pandas as pd

# Load datasets
df_description = pd.read_csv("data/description.csv")
df_diets = pd.read_csv("data/diets.csv")
df_medications = pd.read_csv("data/medications.csv")
df_precautions = pd.read_csv("data/precautions_df.csv")
df_workout = pd.read_csv("data/workout_df.csv")

# Strip whitespace and create maps
description_map = {
    row['Disease'].strip(): row['Description']
    for _, row in df_description.iterrows()
}

diet_map = {
    row['Disease'].strip(): row['Diet']
    for _, row in df_diets.iterrows()
}

med_map = {
    row['Disease'].strip(): row['Medication']
    for _, row in df_medications.iterrows()
}

workout_map = {}
for _, row in df_workout.iterrows():
    disease = row['disease'].strip()
    workout = row['workout']
    if disease in workout_map:
        workout_map[disease].append(workout)
    else:
        workout_map[disease] = [workout]

# Combine workouts into a single string
workout_map = {d: "; ".join(w) for d, w in workout_map.items()}

precautions_map = {}
for _, row in df_precautions.iterrows():
    disease = row['Disease'].strip()
    precautions = [
        row.get('Precaution_1', ''),
        row.get('Precaution_2', ''),
        row.get('Precaution_3', ''),
        row.get('Precaution_4', '')
    ]
    precautions_map[disease] = [p for p in precautions if pd.notna(p)]
