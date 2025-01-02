from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.genre_repository import GenreRepository
from app.core.config import Settings
import requests
import json
import time
import logging

class GenreService:
    
    settings = Settings()
    def __init__(self, db: AsyncSession):
        self.genre_repository = GenreRepository(db)
        
    
    async def get_genres_list(self):
        result = await self.genre_repository.get_genres_list()
        return result