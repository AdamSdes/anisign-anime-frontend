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


class CharacterRepository:
    def __init__(self, db : AsyncSession):
        self.db = db
        
    async def get_characters_list(self, page: int, limit: int):
        query = select(Character).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        return result.scalars().all()
    
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