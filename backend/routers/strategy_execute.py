from fastapi import APIRouter
from app.models.strategy import ExecuteStrategyRequest
from app.services.gemini_service import get_transaction_from_strategy

router = APIRouter()

@router.post("/api/strategy/execute")
async def execute_strategy(request: ExecuteStrategyRequest):
    try:
        
        # NOTE: you can load the user's strategy from DB here instead of using request.strategy directly
        # For now we assume the strategy was passed directly
        
        
        strategy = request.strategy[0]  # MVP: one strategy at a time
        
        
        """ 
        
        # Instead of this line:
        strategy = request.strategy[0]

        # You can do this:
        from app.db import get_strategy_by_user  # hypothetical function

        strategy = get_strategy_by_user(request.user_address)

        
        """
        
        
        tx = get_transaction_from_strategy(strategy.dict(), request.user_address)
        return tx
    except Exception as e:
        return {"error": str(e)}
