from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.anime_save_list_repository import AnimeSaveListRepository
from app.core.config import Settings
import requests
import json
import time
from uuid import UUID
import logging
from app.db.models import AnimeSaveList

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AnimeSaveListService:
    
    settings = Settings()
    def __init__(self, db: AsyncSession):
        self.anime_save_list_repository = AnimeSaveListRepository(db)
        
    async def initialize_anime_save_lists(self, user_id: UUID):
        return await self.anime_save_list_repository.initialize_anime_save_lists(user_id)
        
    async def create_anime_save_list(self, list_name: str, current_user_id: UUID):
        return await self.anime_save_list_repository.create_anime_save_list(list_name, current_user_id)
    
    async def delete_anime_list(self, current_user_id: UUID):
        return await self.anime_save_list_repository.delete_anime_list(current_user_id)
    
    async def get_anime_save_list_by_name(self, list_name: str, current_user_id: UUID):
        return await self.anime_save_list_repository.get_anime_save_list_by_name(list_name ,current_user_id)
    
    async def put_anime_id_in_list(self, list_name: str, anime_id: str, current_user_id: UUID) -> AnimeSaveList:
        anime_list = await self.get_anime_save_list_by_name(list_name, current_user_id)
        if anime_list:
            result = await self.anime_save_list_repository.put_anime_id_in_list(list_name, anime_id, current_user_id)
            return result
    
    async def delete_anime_id_from_list(self, anime_id: str, current_user_id: UUID) -> AnimeSaveList:
        result = await self.anime_save_list_repository.delete_anime_id_from_list(anime_id, current_user_id)
        return result
