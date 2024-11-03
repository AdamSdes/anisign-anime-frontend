from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.anime_repository import AnimeRepository
import requests
import json
class AnimeService:
    def __init__(self, db: AsyncSession):
        self.anime_repository = AnimeRepository(db)

    def get_all(self):
        return self.anime_repository.get_all()
    
    def delete_all(self):
        return self.anime_repository.delete_all()
