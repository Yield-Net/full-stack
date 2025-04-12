from pydantic import BaseModel

class InvestmentRequest(BaseModel):
    wallet_address: str
    amount_eth: float

class InvestmentResponse(BaseModel):
    status: str
    tx_hash: str
