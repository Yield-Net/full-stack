# routers/strategies.py - Extended
from fastapi import APIRouter, HTTPException
from models.strategy import UserProfile, StrategyResponse, MarketResponse
from services.market_data import get_filtered_protocols
from services.strategy_gen import generate_strategy

router = APIRouter(prefix="/strategies")

@router.get("/market-context", response_model=MarketResponse)
def get_market_context():
    try:
        data = get_filtered_protocols()
        return {"protocols": data}
    except Exception as e:
        return {"error": str(e)}

@router.post("/generate-strategy", response_model=StrategyResponse)
def generate(profile: UserProfile):
    try:
        # Pass preferred activities to market context
        preferred = [a.value for a in profile.preferred_activities]
        market_data = get_filtered_protocols(preferred)
        strategy = generate_strategy(profile.model_dump(), market_data)
        return {"strategy": strategy}
    except Exception as e:
        return {"error": str(e)}
