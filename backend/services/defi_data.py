# services/defi_data.py
import requests
import json
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Simple cache to avoid hitting APIs too frequently
_cache = {}
_cache_expiry = {}

async def get_protocols():
    """Fetch list of DeFi protocols from DeFi Llama API"""
    # Check cache first
    if "protocols" in _cache and _cache_expiry.get("protocols", datetime.now()) > datetime.now():
        return _cache["protocols"]
    
    try:
        response = requests.get("https://api.llama.fi/protocols")
        if response.status_code == 200:
            # Filter to top DeFi protocols
            protocols = response.json()
            filtered = [p for p in protocols if p["category"] in ["Lending", "Yield", "Dexes"]][:20]
            
            # Format for our use
            result = [
                {
                    "id": p["slug"],
                    "name": p["name"],
                    "tvl": p["tvl"],
                    "category": p["category"],
                    "chain": p["chain"]
                }
                for p in filtered
            ]
            
            # Store in cache for 5 minutes
            _cache["protocols"] = result
            _cache_expiry["protocols"] = datetime.now() + timedelta(minutes=5)
            
            return result
    except Exception as e:
        print(f"Error fetching protocols: {e}")
        # Return empty list on error
        return []

async def get_protocol_details(protocol_id):
    """Fetch detailed information about a specific protocol"""
    # Check cache first
    cache_key = f"protocol_{protocol_id}"
    if cache_key in _cache and _cache_expiry.get(cache_key, datetime.now()) > datetime.now():
        return _cache[cache_key]
    
    try:
        response = requests.get(f"https://api.llama.fi/protocol/{protocol_id}")
        if response.status_code == 200:
            data = response.json()
            
            # Get APY data (in a real implementation, you'd get actual APY)
            # For hackathon, we'll generate realistic APY based on TVL
            # Smaller protocols tend to have higher APY
            tvl = data.get("tvl", 0)
            if tvl > 1000000000:  # > $1B
                base_apy = 3.5
            elif tvl > 100000000:  # > $100M
                base_apy = 6.2
            else:
                base_apy = 8.7
                
            # Add some randomness
            import random
            apy = base_apy + (random.random() * 2 - 1)  # +/- 1%
            
            result = {
                "id": protocol_id,
                "name": data.get("name", "Unknown"),
                "tvl": data.get("tvl", 0),
                "apy": apy,
                "description": data.get("description", ""),
                "url": data.get("url", ""),
                "category": data.get("category", "DeFi")
            }
            
            # Store in cache for 5 minutes
            _cache[cache_key] = result
            _cache_expiry[cache_key] = datetime.now() + timedelta(minutes=5)
            
            return result
    except Exception as e:
        print(f"Error fetching protocol details: {e}")
        # Return None on error
        return None
