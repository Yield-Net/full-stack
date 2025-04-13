from fastapi import APIRouter
from models.strategy import ExecuteStrategyRequest, Transaction
from services.gemini_service import get_transaction_from_strategy

from supabase import Client
from dotenv import load_dotenv
import os

load_dotenv()
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE')

router = APIRouter()

@router.post("/api/strategy/execute", response_model=list[Transaction])
async def execute_strategy(request: ExecuteStrategyRequest):
    try:
        
        # NOTE: you can load the user's strategy from DB here instead of using request.strategy directly
        # For now we assume the strategy was passed directly
        
        sb = Client(SUPABASE_URL, SUPABASE_KEY)
        user_id = sb.table('users').select('id').eq('wallet_address', request.user_address).execute().data[0]['id']
        strategy =  sb.table('user_strategies').select('strategy_data').eq('user_id', user_id).execute()
        
        results = []
        for s in strategy.data:
            tx = get_transaction_from_strategy(s['strategy_data'], request.user_address)
            results.append(tx)

        return results
    except Exception as e:
        return {"error": str(e)}
