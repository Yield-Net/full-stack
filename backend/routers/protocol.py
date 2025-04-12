# routers/protocols.py
from fastapi import APIRouter, HTTPException
from services.defi_data import get_protocols, get_protocol_details

router = APIRouter(prefix="/protocols")

@router.get("/")
async def list_protocols():
    protocols = await get_protocols()
    return protocols

@router.get("/{protocol_id}")
async def get_protocol(protocol_id: str):
    protocol = await get_protocol_details(protocol_id)
    if not protocol:
        raise HTTPException(status_code=404, detail="Protocol not found")
    return protocol
