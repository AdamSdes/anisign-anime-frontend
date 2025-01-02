from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from fastapi import APIRouter, HTTPException, status
from app.services.user_service import UserService
from app.services.genre_service import GenreService
from app.schemas.user_schemas import SignUpRequestSchema ,UserDetailSchema
from uuid import UUID
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.services.user_service import get_current_user_from_token



genre_router = APIRouter()

@genre_router.get("/get-list-genres",)
async def get_genres_list(db: AsyncSession = Depends(get_session)):
    service = GenreService(db)
    result = await service.get_genres_list()
    return result
