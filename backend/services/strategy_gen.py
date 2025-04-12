import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")

def build_prompt(user_profile: dict, protocol_data: list) -> str:
    return f"""
You are an AI-powered DeFi assistant.

Your task is to take this user's investment profile and suggest an optimal investment strategy across available DeFi protocols.

Only suggest protocols that are active, Ethereum-based, with lending or staking.

--- User Profile ---
{json.dumps(user_profile, indent=2)}

--- Market Data ---
{json.dumps(protocol_data[:20], indent=2)}

Your strategy should include:
- Protocol name
- What activity is recommended (lending/staking)
- Token to use (if clear)
- Allocation % (sum to 100)
- Expected APY
- Estimated return based on investment amount and APY
- Risk level
- Why you chose it

Output format (as JSON array):

[
  {{
    "protocol": "Aave",
    "activity": "lending",
    "token": "USDC",
    "allocation_percent": 60,
    "expected_apy": 5.1,
    "estimated_return": 30.6,
    "risk_level": "low",
    "why": "Safe lending option with decent yield"
  }}
]
Respond ONLY with the JSON. Do not add commentary or explanations.
"""

def extract_json_from_text(text: str) -> list:
    """
    Extracts the first JSON array from Gemini response safely.
    """
    try:
        text = text.strip().removeprefix("```json").removesuffix("```").strip()

        match = re.search(r'\[\s*{.*?}\s*\]', text, flags=re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            raise ValueError("No JSON array found.")
    except Exception as e:
        raise ValueError(f"JSON parsing failed: {e}")

def generate_strategy(user_profile: dict, protocol_data: list) -> list:
    prompt = build_prompt(user_profile, protocol_data)
    response = model.generate_content(prompt)

    try:
        return extract_json_from_text(response.text)
    except Exception as e:
        return {
            "error": "Failed to parse Gemini response",
            "raw_response": response.text,
            "details": str(e)
        }
