from fastapi import APIRouter, HTTPException
from models.users import LoginRequest
from web3 import Web3

from supabase import Client
from dotenv import load_dotenv
import os

load_dotenv()
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE')

router = APIRouter()

INFURA_URL = "https://goerli.infura.io/v3/YOUR_INFURA_KEY"
web3 = Web3(Web3.HTTPProvider(INFURA_URL))


@router.post("/auth/login")
def login_user(data: LoginRequest):
    wallet = Web3.to_checksum_address(data.wallet_address)

    # Mock user store logic — use DB in real scenario
    # create_or_get_user(wallet)  <-- Assume you've done this

    try:
        balance_wei = web3.eth.get_balance(wallet)
        balance_eth = web3.from_wei(balance_wei, 'ether')
        sb = Client(SUPABASE_URL, SUPABASE_KEY)
        user_data = sb.table("users").select("*").eq("wallet_address", wallet).execute()
        if user_data.data:
            user = user_data.data[0]
            if data.email and user["email"] != data.email:
                sb.table("users").update({"email": data.email}).eq("wallet_address", wallet).execute()
        else:
            sb.table("users").insert({"wallet_address": wallet, "email": data.email}).execute()
            user = sb.table("users").select("*").eq("wallet_address", wallet).execute().data[0]

        hasProfile = len(sb.table("user_profiles").select("*").eq("user_id", user["id"]).execute().data) > 0

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "success": True,
        "hasProfile": hasProfile,
        "wallet_address": wallet,
    }
