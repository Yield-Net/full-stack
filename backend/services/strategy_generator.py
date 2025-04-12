# services/strategy_generator.py
from services.defi_data import get_protocols, get_protocol_details
from services.risk_assessor import assess_protocol_risk

# implement ts
def calculate_expected_return():
    return

# implement ts
def investment_horizon_to_days():
    return

async def generate_strategies(user_profile):
    protocols = await get_protocols()
    
    # Filter protocols based on risk tolerance
    risk_level = user_profile["risk_tolerance"]
    filtered_protocols = []
    
    for protocol in protocols:
        protocol_risk = await assess_protocol_risk(protocol["id"])
        if (risk_level == "low" and protocol_risk == "low") or \
           (risk_level == "medium" and protocol_risk in ["low", "medium"]) or \
           (risk_level == "high"):
            filtered_protocols.append(protocol)
    
    # Calculate expected returns
    strategies = []
    for protocol in filtered_protocols[:5]:  # Top 5 matching protocols
        details = await get_protocol_details(protocol["id"])
        expected_return = calculate_expected_return(
            amount=user_profile["investment_amount"],
            apy=details["apy"],
            duration=investment_horizon_to_days(user_profile["investment_horizon"])
        )
        
        strategies.append({
            "protocol": protocol["name"],
            "allocation": 100,  # Simple 100% allocation for now
            "expected_return": expected_return,
            "risk_level": protocol_risk,
            "details": details
        })
    
    # Sort by expected return
    strategies.sort(key=lambda x: x["expected_return"], reverse=True)
    
    return strategies
