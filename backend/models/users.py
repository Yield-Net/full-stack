from pydantic import BaseModel, Field, field_validator
from typing import Dict, List, Optional, Union
from enum import Enum


class LoginRequest(BaseModel):
    wallet_address: str
    email: Optional[str] = None

class LoginResponse(BaseModel):
    success: bool
    hasProfile: bool
    wallet_address: str
    balance: float
    user_id: str
