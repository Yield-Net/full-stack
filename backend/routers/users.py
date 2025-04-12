# routers/users.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.users import UserProfile

router = APIRouter(prefix="/users")

@router.post("/profile")
async def create_user_profile(profile: UserProfile):
    """
    Create a user investment profile.
    """
    # Here you would typically save the profile to a database and return the profile ID.
    # For demonstration, we will just return the profile data.
    return {"message": "User profile created successfully", "profile": profile}
