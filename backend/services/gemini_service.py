import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from models.strategy import Strategy

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-pro-preview-03-25")

def build_prompt(strategy: Strategy, user_address: str) -> str:
    return f"""
You are a smart DeFi AI working ONLY on the Ethereum Sepolia testnet.

Take the following user strategy and return a ready-to-sign Ethereum transaction object.

--- STRATEGY ---
{json.dumps(strategy, indent=2)}

- Use real contract and token addresses from the Sepolia testnet
- Prepare a transaction for Aave (lending) or Uniswap (liquidity_providing)
- Use the user's address below as the sender
- Return only this JSON format:

{{
  "to": "0x...",
  "from": "{user_address}",
  "data": "0x...",
  "value": "0x...",
  "gas": "0x...",
  "gasPrice": "0x..."
}}

Respond ONLY with valid JSON. No explanation.
"""

def get_transaction_from_strategy(strategy: Strategy, user_address: str):
    prompt = build_prompt(strategy, user_address)
    response = model.generate_content(prompt)
    try:
        tx = json.loads(response.text.strip().removeprefix("```json").removesuffix("```").strip())
        return tx
    except Exception as e:
        raise ValueError(f"Gemini JSON parse failed: {e}\nResponse: {response.text}")
