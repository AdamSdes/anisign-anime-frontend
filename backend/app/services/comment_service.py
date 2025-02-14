from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.comment_repository import CommentRepository
from app.repositories.user_repository import UserRepository
from app.repositories.anime_repository import AnimeRepository
from app.core.config import Settings
import requests
import json
from uuid import UUID
import time
from fastapi import Depends ,Query ,Path ,Body
from typing import List
import logging
from fastapi import HTTPException

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CommentService:
    
    settings = Settings()
    def __init__(self, db: AsyncSession):
        self.comment_repository = CommentRepository(db)
        self.anime_repository = AnimeRepository(db)
        self.user_repository = UserRepository(db)
        
    async def create_comment_for_anime(self, anime_id: str, comment_text: str, user_id: str):
        check = await self.user_repository.get_user_by_id(user_id)
        if not check:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Validate anime
        check = await self.anime_repository.get_anime_by_id_uuid(anime_id)
        if not check:
            raise HTTPException(status_code=404, detail="Anime not found")
        
        # Validate UUID format
        try:
            anime_id = UUID(anime_id)
        except ValueError:
            raise HTTPException(status_code=404, detail="Invalid anime_id format")
        
        # Validate comment text
        if not comment_text or len(comment_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Comment text cannot be empty")
        try:
            result = await self.comment_repository.create_comment_for_anime(anime_id, comment_text, user_id)
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