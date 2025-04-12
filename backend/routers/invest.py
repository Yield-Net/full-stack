from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.faucet import send_sepolia_eth

router = APIRouter()

class InvestmentRequest(BaseModel):
    wallet_address: str
    amount_eth: float

@router.post("/invest/fund")
def fund_user_wallet(req: InvestmentRequest):
    try:
        tx_hash = send_sepolia_eth(req.wallet_address, req.amount_eth)
        return {"status": "success", "tx_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


"""


const requestFaucetFunding = async (wallet: string, amount: number) => {
  try {
    const res = await axios.post("http://localhost:8000/api/invest/fund", {
      wallet_address: wallet,
      amount_eth: amount,
    });

    console.log("Funding tx:", res.data.tx_hash);
    alert("Funding started! Tx Hash: " + res.data.tx_hash);
  } catch (e: any) {
    alert("Faucet error: " + e.message);
  }
};



"""
