import os
import json
import re
import google.generativeai as genai

# Ensure API key is loaded correctly
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=api_key)

def fetch_gemini_info(disease_name: str) -> dict:
    try:
        prompt = f"""
        You are a medical assistant. Provide the following treatment details for the disease "{disease_name}":
        1. Typical medication dosage
        2. Common side effects
        3. Important warnings patients should be aware of

        Return the result strictly in this JSON format with no text before or after:
        {{
          "Dosage": "...",
          "Side_Effects": "...",
          "Warnings": "..."
        }}
        """

        model = genai.GenerativeModel("gemini-2.0-flash")  # more stable
        response = model.generate_content(prompt)

        if response.text:
            # Attempt to extract valid JSON
            match = re.search(r"\{.*?\}", response.text.strip(), re.DOTALL)
            if match:
                return json.loads(match.group())
            else:
                print("⚠️ Response not in JSON format:", response.text)
        else:
            print("⚠️ Gemini returned empty response.")

    except Exception as e:
        print(f"❌ Gemini API error: {e}")

    # Safe fallback
    return {
        "Dosage": "N/A",
        "Side_Effects": "N/A",
        "Warnings": "N/A"
    }
