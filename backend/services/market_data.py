import requests

DEFI_LLAMA_API = "https://api.llama.fi/protocols"

ACTIVITY_CATEGORY_MAP = {
    "lending": "lending",
    "staking": "staking",
    "yield_farming": "yield",
    "liquidity_providing": "dexes",
    "trading": "dexes",
}

def get_filtered_protocols(preferred_activities=None, min_tvl=1000000):
    response = requests.get(DEFI_LLAMA_API)

    if response.status_code != 200:
        raise Exception("Failed to fetch from DeFi Llama")

    all_protocols = response.json()
    filtered = []

    if not preferred_activities:
        allowed_categories = set(ACTIVITY_CATEGORY_MAP.values())
    else:
        allowed_categories = {
            ACTIVITY_CATEGORY_MAP.get(a.lower()) for a in preferred_activities
            if ACTIVITY_CATEGORY_MAP.get(a.lower())
        }

    for p in all_protocols:
        category = p.get("category", "").lower()
        if (
            "ethereum" in [c.lower() for c in p.get("chains", [])] and
            p.get("tvl", 0) > min_tvl and
            category in allowed_categories and
            p.get("status", "").lower() != "inactive"
        ):
            filtered.append({
                "name": p["name"],
                "category": p["category"],
                "tvl": p["tvl"],
                "chain": p["chains"],
                "url": p.get("url"),
                "symbol": p.get("symbol", "N/A")
            })

    return filtered
