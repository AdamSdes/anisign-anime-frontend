from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from fastapi import APIRouter, HTTPException, status
from app.services.user_service import UserService
from app.services.character_service import CharacterService
from app.schemas.user_schemas import SignUpRequestSchema ,UserDetailSchema
from uuid import UUID
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.services.user_service import get_current_user_from_token


character_router = APIRouter()

@character_router.get("/save-character-list-in-db",)
async def save_character_list_in_db(db: AsyncSession = Depends(get_session)):
    service = CharacterService(db)
    result = await service.save_characters_list_in_db()
    return result

@character_router.delete("/delete-all-characters")
async def delete_all_characters(db: AsyncSession = Depends(get_session)):
    service = CharacterService(db)
    result = await service.delete_all_characters()
    return {"detail": f"{result}"}

@character_router.get("/get-character-list")
async def get_character_list(page: int = 1, limit: int = 10, db: AsyncSession = Depends(get_session)):
    service = CharacterService(db)
    result = await service.get_characters_list(page, limit)
    return result