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
from app.utils.utils import KIND_ENUM ,RATING_ENUM, STATUS_ENUM, COMMENT_TYPE_ENUM
from app.db.models import User
from typing import Optional



comment_router = APIRouter()

@comment_router.post("/create-comment-for-anime/{comment_type}")
async def create_comment_for_anime(anime_id: str, comment_text: str, reply_to_comment_id: Optional[UUID] = None, comment_type: str = Path(..., description="Select type", enum=COMMENT_TYPE_ENUM), db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    service = CommentService(db)
    if reply_to_comment_id:
        result = await service.create_comment_for_anime(anime_id, comment_text, current_user.id, comment_type, reply_to_comment_id)
    else:
        result = await service.create_comment_for_anime(anime_id, comment_text, current_user.id, comment_type)
    return result

@comment_router.get("/get-all-comments-for-anime/{anime_id}")
async def get_all_comments_for_anime(anime_id: str, db: AsyncSession = Depends(get_session)):
    service = CommentService(db)
    result = await service.get_all_comments_for_anime(anime_id)
    return result

@comment_router.delete("/delete-comment/{comment_id}")
async def delete_comment(comment_id: UUID, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    service = CommentService(db)
    current_user_id = current_user.id
    result = await service.delete_comment(comment_id, current_user_id)
    return result

@comment_router.put("/update-comment/{comment_id}")
async def update_comment(comment_id: UUID, text: str, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    service = CommentService(db)
    current_user_id = current_user.id
    result = await service.update_comment(comment_id, text, current_user_id)
    return result

@comment_router.put("/like-comment/{comment_id}")
async def like_comment(comment_id: UUID, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    service = CommentService(db)
    current_user_id = current_user.id
    result = await service.like_comment(comment_id, current_user_id)
    return result

@comment_router.put("/dislike-comment/{comment_id}")
async def dislike_comment(comment_id: UUID, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    service = CommentService(db)
    current_user_id = current_user.id
    result = await service.dislike_comment(comment_id, current_user_id)
    return result

@comment_router.get("/get_10_latest_comments")
async def get_10_latest_comments(db: AsyncSession = Depends(get_session)):
    service = CommentService(db)
    result = await service.get_10_latest_comments()
    return result