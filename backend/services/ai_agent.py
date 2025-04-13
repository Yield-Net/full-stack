import os
import json
import re
import requests
from dotenv import load_dotenv
from typing import Dict, Any
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")


def analyse_user_message(user_profile: dict, user_message: str) -> Dict[str, Any]:
    prompt = f"""
You are a DeFi portfolio assistant.

The user has sent this message: "{user_message}"

Here is their current investment profile:
{json.dumps(user_profile, indent=2)}

You must do the following:

1. Determine if the message indicates a change to the user's investment profile.
2. If yes, update the profile accordingly and return the new profile.
3. If no, return a friendly, short response to the message without changing anything.

Respond ONLY with a JSON object of the following format:
{{
  "profile_changed": true/false,
  "updated_profile": {{...}}, // Only if changed
  "response": "Your response to the user" 
}}

ONLY return valid JSON.
"""
    response = model.generate_content(prompt)
    try:
        content = response.text.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(content)
    except Exception as e:
        return {"profile_changed": False, "response": "Sorry, I couldn’t understand that. Could you rephrase?"}


def get_strategy_from_api(updated_profile: dict) -> Any:
    try:
        res = requests.post(
            url="http://localhost:8000/strategies/generate-strategy",
            json=updated_profile,
            timeout=10
        )
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {"error": "Failed to fetch strategy", "details": str(e)}
