from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.comment_repository import CommentRepository
from app.repositories.user_repository import UserRepository
from app.repositories.anime_repository import AnimeRepository
from app.core.config import Settings
from app.db.models import CommentTypeEnum
import requests
import json
from uuid import UUID
import time
from fastapi import Depends ,Query ,Path ,Body
from typing import List
import logging
from typing import Optional
from fastapi import HTTPException

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CommentService:
    
    settings = Settings()
    def __init__(self, db: AsyncSession):
        self.comment_repository = CommentRepository(db)
        self.anime_repository = AnimeRepository(db)
        self.user_repository = UserRepository(db)
        
    async def create_comment_for_anime(self, anime_id: str, comment_text: str, user_id: str, comment_type: str, reply_to_comment_id: Optional[UUID] = None):
        check = await self.user_repository.get_user_by_id(user_id)
        if not check:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Validate anime
        check = await self.anime_repository.get_anime_by_id_uuid(anime_id)
        if not check:
            raise HTTPException(status_code=404, detail="Anime not found")
        id_of_anime = check.anime_id
        # raise HTTPException(status_code=404, detail="anime found")
        
        
        # Validate UUID format
        try:
            anime_id = UUID(anime_id)
        except ValueError:
            raise HTTPException(status_code=404, detail="Invalid anime_id format")
        
        # if comment_type == "comment":
        #     raise HTTPException(status_code=400, detail="Comment")
        # if comment_type == "reply":
        #     raise HTTPException(status_code=400, detail="reply")
        
        # Validate comment text
        if not comment_text or len(comment_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Comment text cannot be empty")
        try:
            result = await self.comment_repository.create_comment_for_anime(anime_id, comment_text, user_id, comment_type, id_of_anime, reply_to_comment_id)
            return result
        except Exception as e:
            logger.error(f"Error in create_comment_for_anime: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal Server Error {str(e)}")
        

        
    async def get_all_comments_for_anime(self, anime_id: str):
        # Validate anime
        check = await self.anime_repository.get_anime_by_id_uuid(anime_id)
        if not check:
            raise HTTPException(status_code=404, detail="Anime not found")
        
        # Validate UUID format
        try:
            anime_id = UUID(anime_id)
        except ValueError:
            raise HTTPException(status_code=404, detail="Invalid anime_id format")
        
        try:
            result = await self.comment_repository.get_all_comments_for_anime(anime_id)
            return result
        except Exception as e:
            logger.error(f"Error in get_all_comments_for_anime: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal Server Error {str(e)}")
        
        
    async def delete_comment(self, comment_id: UUID, user_id: UUID):
        check = await self.user_repository.get_user_by_id(user_id)
        if not check:
            raise HTTPException(status_code=404, detail="User not found")
        check = await self.comment_repository.get_comment_by_id(comment_id)
        if not check:
            raise HTTPException(status_code=404, detail="Comment not found")
        check_user_permission = await self.comment_repository.check_user_permission_to_comment(user_id, comment_id)
        if not check_user_permission:
            raise HTTPException(status_code=403, detail="You are not authorized to delete this comment")
        else:
            try:
                await self.comment_repository.delete_reply_to_comment(comment_id)
                result = await self.comment_repository.delete_comment(comment_id)
                return result
            except Exception as e:
                logger.error(f"Error in delete_comment: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Internal Server Error {str(e)}")
        
    async def update_comment(self, comment_id: UUID, text: str, user_id: UUID):
        check = await self.user_repository.get_user_by_id(user_id)
        if not check:
            raise HTTPException(status_code=404, detail="User not found")
        check = await self.comment_repository.get_comment_by_id(comment_id)
        if not check:
            raise HTTPException(status_code=404, detail="Comment not found")
        check_user_permission = await self.comment_repository.check_user_permission_to_comment(user_id, comment_id)
        if not check_user_permission:
            raise HTTPException(status_code=403, detail="You are not authorized to delete this comment")
        else:
            # Validate comment text
            if not text or len(text.strip()) == 0:
                raise HTTPException(status_code=400, detail="Comment text cannot be empty")
            try:
                result = await self.comment_repository.update_comment(comment_id, text)
                return result
            except Exception as e:
                logger.error(f"Error in update_comment: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Internal Server Error {str(e)}")
            
    async def like_comment(self, comment_id: UUID, user_id: UUID):
        check = await self.user_repository.get_user_by_id(user_id)
        if not check:
            raise HTTPException(status_code=404, detail="User not found")
        check = await self.comment_repository.get_comment_by_id(comment_id)
        if not check:
            raise HTTPException(status_code=404, detail="Comment not found")
        try:
            result = await self.comment_repository.like_comment(comment_id, user_id)
            return result
        except Exception as e:
            logger.error(f"Error in like_comment: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal Server Error {str(e)}")
        
    async def dislike_comment(self, comment_id: UUID, user_id: UUID):
        check = await self.user_repository.get_user_by_id(user_id)
        if not check:
            raise HTTPException(status_code=404, detail="User not found")
        check = await self.comment_repository.get_comment_by_id(comment_id)
        if not check:
            raise HTTPException(status_code=404, detail="Comment not found")
        try:
            result = await self.comment_repository.dislike_comment(comment_id, user_id)
            return result
        except Exception as e:
            logger.error(f"Error in dislike_comment: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal Server Error {str(e)}")
        
    async def get_3_latest_comments(self):
        try:
            result = await self.comment_repository.get_3_latest_comments()
            return result
        except Exception as e:
            logger.error(f"Error in get_3_latest_comments: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal Server Error {str(e)}")
        