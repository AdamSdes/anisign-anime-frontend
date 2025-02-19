from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.comment_repository import CommentRepository
from app.repositories.user_repository import UserRepository
from app.repositories.anime_repository import AnimeRepository
from app.repositories.viewhistory_repository import ViewHistoryRepository
from app.core.config import Settings
from app.services.user_service import UserService
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

class ViewHistoryService:
    
    settings = Settings()
    def __init__(self, db: AsyncSession):
        self.anime_repository = AnimeRepository(db)
        self.user_repository = UserRepository(db)
        self.viewhistory_repository = ViewHistoryRepository(db)
        
    async def get_view_history_of_user(self, user_id: UUID):
        check = await self.user_repository.get_user_by_id(user_id)
        if not check:
            raise HTTPException(status_code=404, detail="User not found")
        
        result = await self.viewhistory_repository.get_view_history_of_user(user_id)
        return result
    
    async def add_anime_to_view_history_of_user(self, anime_id, user_id):
        check = await self.user_repository.get_user_by_id(user_id)
        if not check:
            raise HTTPException(status_code=404, detail="User not found")
        
        check = await self.anime_repository.get_anime_by_id_uuid(anime_id)
        if not check:
            raise HTTPException(status_code=404, detail="Anime not found")
        
        try:
            result = await self.viewhistory_repository.add_anime_to_view_history_of_user(anime_id, user_id)
            return result
        except Exception as e:
            logger.error(f"Error in add_anime_to_view_history_of_user: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal Server Error {str(e)}")