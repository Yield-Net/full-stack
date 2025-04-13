from fastapi import APIRouter
from models.user import MessageRequest
from services.ai_agent import analyse_user_message, get_strategy_from_api

router = APIRouter()

@router.post("/ai-agent/message")
async def handle_message(payload: MessageRequest):
    user_profile_dict = payload.user_profile.dict()
    message = payload.user_message

    analysis = analyse_user_message(user_profile_dict, message)

    if analysis.get("profile_changed"):
        updated_profile = analysis["updated_profile"]
        strategy = get_strategy_from_api(updated_profile)
        return {
            "message": analysis["response"],
            "profile_changed": True,
            "updated_profile": updated_profile,
            "new_strategy": strategy.get("strategy", [])
        }

    else:
        is_crypto = analysis.get("crypto_related", False)
        base_msg = analysis.get("response", "Got your message!")

        if not is_crypto:
            base_msg = f"This isn’t related to crypto, but here’s my take: {base_msg}"

        return {
            "message": base_msg,
            "profile_changed": False
        }
