from pydantic import BaseModel, Field, field_validator
from typing import Dict, List, Optional, Union
from enum import Enum


class RiskTolerance(str, Enum):
    CONSERVATIVE = "conservative"
    MODERATELY_CONSERVATIVE = "moderately_conservative"
    MODERATE = "moderate"
    MODERATELY_AGGRESSIVE = "moderately_aggressive"
    AGGRESSIVE = "aggressive"


class InvestmentHorizon(str, Enum):
    SHORT = "short"  # < 1 year
    MEDIUM = "medium"  # 1-3 years
    LONG = "long"  # 3+ years


class ExperienceLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class InvestmentGoal(str, Enum):
    PASSIVE_INCOME = "passive_income"
    CAPITAL_GROWTH = "capital_growth"
    WEALTH_PRESERVATION = "wealth_preservation"
    PORTFOLIO_DIVERSIFICATION = "portfolio_diversification"


class IncomeFrequency(str, Enum):
    NONE = "none"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUALLY = "annually"


class DeFiActivity(str, Enum):
    STAKING = "staking"
    YIELD_FARMING = "yield_farming"
    LENDING = "lending"
    LIQUIDITY_PROVIDING = "liquidity_providing"
    TRADING = "trading"


class UserProfile(BaseModel):
    """User investment profile model"""
    
    risk_tolerance: RiskTolerance = Field(..., description="User's risk tolerance level")
    investment_amount: float = Field(..., gt=0, description="Amount user wants to invest")
    investment_currency: str = Field("USD", description="Currency of investment (USD, ETH, BTC, etc.)")
    investment_horizon: InvestmentHorizon = Field(..., description="Investment time horizon")
    experience_level: ExperienceLevel = Field(..., description="User's experience with crypto/DeFi")
    investment_goals: List[InvestmentGoal] = Field(..., description="User's investment goals")
    existing_portfolio: Optional[Dict[str, float]] = Field(None, description="User's existing crypto holdings as asset:amount pairs")
    income_source: IncomeFrequency = Field("none", description="Frequency of regular contributions")
    income_amount: Optional[float] = Field(None, ge=0, description="Amount of regular contribution")
    jurisdiction: Optional[str] = Field(None, description="User's country/jurisdiction")
    preferred_activities: List[DeFiActivity] = Field([], description="User's preferred DeFi activities")

    @field_validator('income_amount')
    def validate_income_amount(cls, v, values):
        if values.data.get('income_source') != 'none' and (v is None or v <= 0):
            raise ValueError('Income amount must be provided and greater than 0 when income source is specified')
        return v

    @field_validator('investment_goals')
    def validate_goals(cls, v):
        if not v:
            raise ValueError('At least one investment goal must be selected')
        return v

    class Config:
        use_enum_values = True
        schema_extra = {
            "example": {
                "risk_tolerance": "moderate",
                "investment_amount": 1000.0,
                "investment_currency": "USD",
                "investment_horizon": "medium",
                "experience_level": "beginner",
                "investment_goals": ["passive_income", "capital_growth"],
                "existing_portfolio": {"BTC": 0.01, "ETH": 0.5},
                "income_source": "monthly",
                "income_amount": 100.0,
                "jurisdiction": "US",
                "preferred_activities": ["staking", "lending"]
            }
        }

class LoginRequest(BaseModel):
    wallet_address: str
    email: str | None = None
