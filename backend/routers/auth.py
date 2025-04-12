from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from web3 import Web3

router = APIRouter()

INFURA_URL = "https://goerli.infura.io/v3/YOUR_INFURA_KEY"
web3 = Web3(Web3.HTTPProvider(INFURA_URL))

class LoginRequest(BaseModel):
    wallet_address: str

@router.post("/auth/login")
def login_user(data: LoginRequest):
    wallet = Web3.to_checksum_address(data.wallet_address)

    # Mock user store logic — use DB in real scenario
    # create_or_get_user(wallet)  <-- Assume you've done this

    try:
        balance_wei = web3.eth.get_balance(wallet)
        balance_eth = web3.from_wei(balance_wei, 'ether')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "wallet_address": wallet,
        "balance": str(balance_eth),
    }
