from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.anime_repository import AnimeRepository
from app.repositories.character_repository import CharacterRepository
from app.core.config import Settings
import requests
import json
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CharacterService:
    
    settings = Settings()
    def __init__(self, db: AsyncSession):
        self.character_repository = CharacterRepository(db)
        
    async def get_characters_list(self, page: int, limit: int):
        result = await self.character_repository.get_characters_list(page, limit)
        return result
    
    async def get_character_by_id(self, character_id: str):
        return await self.character_repository.get_character_by_id(character_id)
    
    async def get_character_by_name(self, name: str):
        return await self.character_repository.get_character_by_name(name)
    
    async def parse_page_characters(self, page_num):
        characters = []
        base_url = "https://shikimori.one/api/graphql"
        
        headers = {
            'User-Agent': 'AnimeParser/1.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        query = f"""
        {{
            characters(page: {page_num}, limit: 50) {{
                id
                malId
                name
                russian
                japanese
                synonyms
                url
                createdAt
                updatedAt
                isAnime
                isManga
                isRanobe

                poster {{ id originalUrl mainUrl }}

                description
                descriptionHtml
                descriptionSource
            }}
        }}
        """
        
        try:
            response = requests.post(
                base_url,
                headers=headers,
                json={'query': query}
            )
            response.raise_for_status()
            data = response.json()["data"]["characters"]
            if data:
                for character in data:
                    transformed_character = {
                        "character_id": character["id"],
                        "name": character["name"],
                        "russian": character["russian"],
                        "japanese": character["japanese"],
                        "poster_url": character["poster"]["originalUrl"] if character["poster"] else None,
                        "description": character["description"]
                    }
                    characters.append(transformed_character)
                logger.info(f"Page characters {page_num} fetched")
                print(f"Page characters{page_num} fetched")
        
                time.sleep(0.5)
                return characters 
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error occurred: {e}")
            return None
    
    async def save_characters_list_in_db(self):
        for x in range(1, 1000):
            characters = await self.parse_page_characters(x)
            if characters:
                await self.character_repository.save_characters_list(characters)
            else:
                logger.error(f"Error occurred while fetching page {x}")
                return None
            
        return {"message": "Characters list saved successfully"}
    
    
    async def delete_all_characters(self):
        result = await self.character_repository.delete_all()
        return result