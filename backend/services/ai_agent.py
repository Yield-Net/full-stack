import os
import json
import re
import requests
from dotenv import load_dotenv
from typing import Dict, Any
import google.generativeai as genai
from services.market_data import get_filtered_protocols
from services.strategy_gen import generate_strategy

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="models/gemini-2.5-pro-preview-03-25")


def analyse_user_message(user_profile: dict, user_message: str) -> Dict[str, Any]:
    prompt = f"""
You are a DeFi portfolio assistant.

The user has sent this message: "{user_message}"

Here is their current investment profile:
{json.dumps(user_profile, indent=2)}

Your task is to:
1. Determine if the message requests or implies a change in the investment profile.
2. Determine whether the message is related to crypto/DeFi or not.
3. If related to crypto but no change is needed, respond appropriately.
4. If not related to crypto, respond politely and mention that.
5. Follow these enums strictly:
class RiskTolerance(str, Enum):
    CONSERVATIVE = 'conservative'
    MODERATE = 'moderate'
    AGGRESSIVE = 'aggressive'

class InvestmentHorizon(str, Enum):
    SHORT = 'short'
    MEDIUM = 'medium'
    LONG = 'long'

class ExperienceLevel(str, Enum):
    BEGINNER = 'beginner'
    INTERMEDIATE = 'intermediate'
    ADVANCED = 'advanced'

class InvestmentGoal(str, Enum):
    PASSIVE_INCOME = 'passive_income'
    CAPITAL_GROWTH = 'capital_growth'
    WEALTH_PRESERVATION = 'wealth_preservation'
    PORTFOLIO_DIVERSIFICATION = 'portfolio_diversification'

class DeFiActivity(str, Enum):
    STAKING = 'staking'
    YIELD_FARMING = 'yield_farming'
    LENDING = 'lending'
    LIQUIDITY_PROVIDING = 'liquidity_providing'
    TRADING = 'trading'

Respond ONLY with valid JSON, in the following structure:

If profile is changed:
{{
  "profile_changed": true,
  "updated_profile": {{ ... }},
  "response": "Let the user know the profile was updated."
}}

If profile is not changed:
{{
  "profile_changed": false,
  "crypto_related": true/false,
  "response": "Your helpful or polite message here."
}}

Do not include any other commentary.
"""
    response = model.generate_content(prompt)
    try:
        content = response.text.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(content)
    except Exception as e:
        return {
            "profile_changed": False,
            "crypto_related": False,
            "response": "Sorry, I couldn’t process that. Could you try rephrasing your message?"
        }


def new_strategy(profile: dict) -> list:
    try:
        # Pass preferred activities to market context
        preferred = [a for a in profile['preferred_activities']]
        print("Preferred activities:", preferred)
        market_data = get_filtered_protocols(preferred)
        strategy = generate_strategy(profile, market_data)
        
        return strategy
    except Exception as e:
        return []
