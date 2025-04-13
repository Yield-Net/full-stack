from pydantic import BaseModel
from typing import Optional
from models.strategy import UserProfile  # Importing from strategy.py

class LoginRequest(BaseModel):
    wallet_address: str
    email: Optional[str] = None

class LoginResponse(BaseModel):
    success: bool
    hasProfile: bool
    wallet_address: str
    balance: float
    user_id: str

class MessageRequest(BaseModel):
    user_profile: UserProfile
    user_message: str