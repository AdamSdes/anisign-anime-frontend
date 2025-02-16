from fastapi import APIRouter
from fastapi import Depends ,Query ,Path ,Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from fastapi import APIRouter, HTTPException, status
from app.services.comment_service import CommentService
from app.schemas.user_schemas import SignUpRequestSchema ,UserDetailSchema
from uuid import UUID
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.services.user_service import get_current_user_from_token
from app.utils.utils import KIND_ENUM ,RATING_ENUM, STATUS_ENUM
from app.db.models import User


comment_router = APIRouter()

@comment_router.post("/create-comment-for-anime")
async def create_comment_for_anime(anime_id: str, comment_text: str, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    service = CommentService(db)
    result = await service.create_comment_for_anime(anime_id, comment_text, current_user.id)
    return result

@comment_router.get("/get-all-comments-for-anime/{anime_id}")
async def get_all_comments_for_anime(anime_id: str, db: AsyncSession = Depends(get_session)):
    service = CommentService(db)
    result = await service.get_all_comments_for_anime(anime_id)
    return result

@comment_router.delete("/delete-comment/{comment_id}")
async def delete_comment(comment_id: UUID, db: AsyncSession = Depends(get_session)):
    service = CommentService(db)
    result = await service.delete_comment(comment_id)
    return result

@comment_router.put("/update-comment/{comment_id}")
async def update_comment(comment_id: UUID, text: str, db: AsyncSession = Depends(get_session)):
    service = CommentService(db)
    result = await service.update_comment(comment_id, text)
    return result