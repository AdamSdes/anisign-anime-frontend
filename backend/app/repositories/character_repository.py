from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from app.db.models import Character
import logging
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from dateutil import parser
from sqlalchemy import func

class CharacterRepository:
    def __init__(self, db : AsyncSession):
        self.db = db
        
    async def get_characters_list(self, page: int, limit: int):
        query = select(Character).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        characters = result.scalars().all()
        
        # Query to count the total number of characters
        count_query = select(func.count(Character.id))
        total_count_result = await self.db.execute(count_query)
        total_count = total_count_result.scalar()
        
        # Return both the characters list and the total count
        return {
            "total_count": total_count,
            "characters": characters
        }
    
    async def get_character_by_name(self, name: str):
        query = select(Character).where(
                Character.russian.ilike(f'%{name}%')
        )
        result = await self.db.execute(query)
        character_list = result.scalars().all()

        total_count = len(character_list)

        return {"total_count": total_count, "character_list": character_list}
    
    async def get_character_by_id(self, character_id: str):
        character = await self.db.execute(select(Character).where(Character.character_id == character_id))
        character = character.scalars().first()
        return character
    
    async def save_characters_list(self,characters: list):
        for character in characters:
            try:
                character_instance = Character(**character)
                self.db.add(character_instance)
                await self.db.commit()
                await self.db.refresh(character_instance)
                
            except IntegrityError as e:
                await self.db.rollback()
                logging.error(f"Duplicate entry for character: {character.get('name', 'unknown')}, Error: {e}")
                continue
            
    async def delete_all(self):
        query = delete(Character)
        result = await self.db.execute(query)
        await self.db.commit()
        return result.rowcount