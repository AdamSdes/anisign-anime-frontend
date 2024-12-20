from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from fastapi import APIRouter, HTTPException, status
from app.services.user_service import UserService
from app.services.anime_service import AnimeService
from app.schemas.user_schemas import SignUpRequestSchema ,UserDetailSchema
from uuid import UUID
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.services.user_service import get_current_user_from_token

anime_router = APIRouter()

@anime_router.get("/save-anime-list-in-db",)
async def save_anime_list_in_db(db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.save_anime_list_in_db()
    return {"detail": f"{result}"}  

@anime_router.delete("/delete-all-anime")
async def delete_all_anime(db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.delete_all()
    return {"detail": f"{result}"}
    