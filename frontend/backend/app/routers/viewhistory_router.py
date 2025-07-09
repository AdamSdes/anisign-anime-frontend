from fastapi import APIRouter
from fastapi import Depends ,Query ,Path ,Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from fastapi import APIRouter, HTTPException, status
from app.services.viewhistory_service import ViewHistoryService
from app.schemas.user_schemas import SignUpRequestSchema ,UserDetailSchema
from uuid import UUID
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.services.user_service import get_current_user_from_token
from app.utils.utils import KIND_ENUM ,RATING_ENUM, STATUS_ENUM, COMMENT_TYPE_ENUM
from app.db.models import User
from typing import Optional



viewhistory_router = APIRouter()

@viewhistory_router.post("/get-view-history-of-user/{user_id}")
async def get_view_history_of_user(user_id: UUID, db: AsyncSession = Depends(get_session)):
    service = ViewHistoryService(db)
    result = await service.get_view_history_of_user(user_id)
    return result

@viewhistory_router.post("/add-anime-to-view-history-of-user/{user_id}")
async def add_anime_to_view_history_of_user(anime_id: str, user_id: UUID, db: AsyncSession = Depends(get_session)):
    service = ViewHistoryService(db)
    result = await service.add_anime_to_view_history_of_user(anime_id, user_id)
    return result
