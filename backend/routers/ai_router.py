from fastapi import APIRouter
from models.users import MessageRequest, UpdateProfileRequest
from services.ai_agent import analyse_user_message, new_strategy

from supabase import Client
from dotenv import load_dotenv
import os

load_dotenv()
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE')
router = APIRouter()

@router.post("/ai-agent/message")
async def handle_message(payload: MessageRequest):
    print(payload)
    user_profile_dict = payload.user_profile.dict()
    message = payload.user_message

    analysis = analyse_user_message(user_profile_dict, message)

    if analysis.get("profile_changed"):
        updated_profile = analysis["updated_profile"]

        print("\n\nUpdated profile:", updated_profile)
        strategy = new_strategy(updated_profile)
        print("\n\nNew strategy:", strategy)

        #db inserts into here

        return {
            "message": analysis["response"],
            "profile_changed": True,
            "updated_profile": updated_profile,
            "new_strategy": strategy
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
    
@router.patch("/ai-agent/update-profile")
async def update_profile(payload: UpdateProfileRequest):
    print(payload)
    if payload.user_confirmed:
        try:
            sb = Client(SUPABASE_URL, SUPABASE_KEY)
            user_id = payload.updated_profile.user_id

            # delete old profile and old strategies
            sb.table("user_profiles").delete().eq("user_id", user_id).execute()
            sb.table("user_strategies").delete().eq("user_id", user_id).execute()

            # insert new profile and new strategies
            sb.table("user_profiles").insert(payload.updated_profile.model_dump()).execute()
            for s in payload.new_strategy:
                sb.table("user_strategies").insert({
                    "user_id": user_id,
                    "strategy_data": s,
                    "is_active": True
                }).execute()
            return {"updated": True}
        except Exception as e:
            return {"error": str(e)}
    else:
        return {"updated": False}

