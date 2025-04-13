from fastapi import APIRouter
from models.strategy import ExecuteStrategyRequest, Transaction
from models.dashboard import DashboardResponse
from services.gemini_service import get_transaction_from_strategy

from supabase import Client
from dotenv import load_dotenv
import os

load_dotenv()
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE')

router = APIRouter()

@router.post("/strategy/execute", response_model=Transaction)
async def execute_strategy(request: ExecuteStrategyRequest):
    try:
        
        # NOTE: you can load the user's strategy from DB here instead of using request.strategy directly
        # For now we assume the strategy was passed directly
        print(request.user_address)
        sb = Client(SUPABASE_URL, SUPABASE_KEY)
        user_id = sb.table('users').select('id').eq('wallet_address', request.user_address.lower()).execute().data[0]['id']
        strategy =  sb.table('user_strategies').select('strategy_data').eq('user_id', user_id).execute()
        
        for i, s in enumerate(strategy.data):
            if i == request.idx:
                tx = get_transaction_from_strategy(s['strategy_data'], request.user_address)

        return tx
    except Exception as e:
        return {"error": str(e)}

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(user_id: str):
    try:
        sb = Client(SUPABASE_URL, SUPABASE_KEY)
        user_data = sb.table("users").select("*").eq("id", user_id).execute()
        if not user_data.data:
            return {"error": "User not found"}
        
        user = user_data.data[0]
        profile_data = sb.table("user_profiles").select("risk_tolerance, investment_amount, investment_currency, investment_horizon, experience_level, investment_goals, preferred_activities").eq("user_id", user["id"]).execute()
        portfolio_data = sb.table("user_portfolio").select("asset, amount").eq("user_id", user["id"]).execute()
        strategies_data = sb.table("user_strategies").select("strategy_data").eq("user_id", user["id"]).execute()

        return {
            "profile": profile_data.data[0],
            "portfolio": portfolio_data.data,
            "strategies": strategies_data.data,
        }
    except Exception as e:
        return {"error": str(e)}
