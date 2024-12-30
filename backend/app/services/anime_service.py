from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.anime_repository import AnimeRepository
from app.core.config import Settings
import requests
import json
class AnimeService:
    
    settings = Settings()
    def __init__(self, db: AsyncSession):
        self.anime_repository = AnimeRepository(db)

    def get_all(self):
        return self.anime_repository.get_all()
    
    def delete_all(self):
        return self.anime_repository.delete_all()
    
    async def get_anime_list(self, page: int, limit: int):
        result = await self.anime_repository.get_anime_list(page, limit)
        return result
    
    async def save_anime_list_in_db(self):
        api_token = self.settings.api_token
        url = f"https://kodikapi.com/list?token={api_token}&limit=100"
        response_total = requests.get(url)
        total = json.loads(response_total.text)["total"]
        items = []
        
        while len(items) < total:
            response = requests.get(url)
            data = json.loads(response.text)
            
            items.extend(data["results"])
            
            if "next_page" in data and data["next_page"]:
                url = data["next_page"]
            else:
                break
        
        result = await self.anime_repository.save_anime_list(items)
        return {"message": f"{result}" , "total": f"{total}"}
        
            
        
        
        
        
