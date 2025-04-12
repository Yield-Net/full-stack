from enum import Enum
from typing import List, Optional
from pydantic import BaseModel

class RiskTolerance(str, Enum):
    CONSERVATIVE = 'conservative'
    MODERATELY_CONSERVATIVE = 'moderately_conservative'
    MODERATE = 'moderate'
    MODERATELY_AGGRESSIVE = 'moderately_aggressive'
    AGGRESSIVE = 'aggressive'

class InvestmentHorizon(str, Enum):
    SHORT = 'short'
    MEDIUM = 'medium'
    LONG = 'long'

class ExperienceLevel(str, Enum):
    BEGINNER = 'beginner'
    INTERMEDIATE = 'intermediate'
    ADVANCED = 'advanced'

class InvestmentGoal(str, Enum):
    PASSIVE_INCOME = 'passive_income'
    CAPITAL_GROWTH = 'capital_growth'
    WEALTH_PRESERVATION = 'wealth_preservation'
    PORTFOLIO_DIVERSIFICATION = 'portfolio_diversification'

class DeFiActivity(str, Enum):
    STAKING = 'staking'
    YIELD_FARMING = 'yield_farming'
    LENDING = 'lending'
    LIQUIDITY_PROVIDING = 'liquidity_providing'
    TRADING = 'trading'

class UserProfile(BaseModel):
    user_id: str
    risk_tolerance: RiskTolerance
    investment_amount: float
    investment_currency: Optional[str] = "USDC"
    investment_horizon: InvestmentHorizon
    experience_level: ExperienceLevel
    investment_goals: List[InvestmentGoal]
    preferred_activities: List[DeFiActivity]

class Strategy(BaseModel):
    protocol: str
    activity: DeFiActivity
    token: str
    allocation_percent: float
    expected_apy: float
    estimated_return: float
    risk_level: str
    why: str

class StrategyResponse(BaseModel):
    strategy: List[Strategy]

class Protocol(BaseModel):
    name: str
    category: str
    tvl: float
    chain: List[str]
    url: str
    symbol: str

class MarketResponse(BaseModel):
    protocols: List[Protocol]
