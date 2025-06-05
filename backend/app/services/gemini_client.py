import os
import json
import re
import google.generativeai as genai

# Ensure API key is loaded correctly
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=api_key)

# ✅ EXISTING FUNCTION (Do not remove)
def fetch_gemini_info(disease_name: str) -> dict:
    try:
        prompt = f"""
        You are a medical assistant. Provide the following treatment details for the disease "{disease_name}":
        1. Typical medication dosage
        2. Common side effects
        3. Important warnings patients should be aware of
        4. Common medication interactions patients should know

        Return the result strictly in this JSON format with no text before or after:
        {{
          "Dosage": "...",
          "Side_Effects": "...",
          "Warnings": "...",
          "Interactions": "..."
        }}
        """

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)

        if response.text:
            match = re.search(r"\{.*?\}", response.text.strip(), re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except json.JSONDecodeError as e:
                    print(f"⚠️ JSON decode error: {e}")
                    print("Response text:", response.text)
            else:
                print("⚠️ Response not in JSON format:", response.text)
        else:
            print("⚠️ Gemini returned empty response.")
    except Exception as e:
        print(f"❌ Gemini API error: {e}")

    return {
        "Dosage": "N/A",
        "Side_Effects": "N/A",
        "Warnings": "N/A",
        "Interactions": "N/A"
    }

# ✅ NEW FUNCTION (Add this below the old one)
def fetch_drug_interactions(drugs: list[str]) -> dict:
    try:
        drug_list = ", ".join(drugs)
        prompt = f"""
You are a medical assistant. Check if there are any interactions between the following drugs: {drug_list}.
Provide a detailed response in ONLY JSON format like this:

{{
  "Interactions": [
    {{
      "Drugs": "DrugA + DrugB",
      "Level": "None | Mild | Moderate | Severe",
      "Description": "Short summary of the interaction or say 'No known interaction.'"
    }}
  ]
}}

ONLY return this JSON object. Do NOT include any other text or markdown formatting.
"""

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        print("🔍 Raw Gemini Response:", response.text)

        if response.text:
            # Clean up ```json markdown wrappers if present
            cleaned = re.sub(r"^```json|```$", "", response.text.strip(), flags=re.MULTILINE).strip()
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except json.JSONDecodeError as e:
                    print(f"⚠️ JSON decode error: {e}")
                    print("❌ Raw Text:", response.text)
        else:
            print("⚠️ Gemini returned empty response.")

    except Exception as e:
        print(f"❌ Gemini API error: {e}")

    return {
        "Interactions": [
            {
                "Drugs": "N/A",
                "Level": "N/A",
                "Description": "Interaction information unavailable."
            }
        ]
    }
