# routers/users.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.users import UserProfile

router = APIRouter(prefix="/users")

