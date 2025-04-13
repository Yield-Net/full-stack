from pydantic import BaseModel
from typing import Dict, List, Optional
from models.strategy import RiskTolerance, InvestmentHorizon, ExperienceLevel, InvestmentGoal, DeFiActivity

class UserProfile(BaseModel):
    risk_tolerance: RiskTolerance
    investment_amount: float
    investment_currency: str = "ETH"
    investment_horizon: InvestmentHorizon
    experience_level: ExperienceLevel
    investment_goals: List[InvestmentGoal]
    preferred_activities: List[DeFiActivity]

class UserPortfolio(BaseModel):
    asset: str
    amount: float

class UserStrategy(BaseModel):
    protocol: str
    activity: DeFiActivity
    token: str
    allocation_percent: float
    expected_apy: float
    estimated_return: float
    risk_level: str
    why: str

class StrategyWrapper(BaseModel):
    strategy_data: UserStrategy

class DashboardResponse(BaseModel):
    profile: UserProfile
    portfolio: Optional[List[UserPortfolio]] = None
    strategies: Optional[List[StrategyWrapper]] = None
