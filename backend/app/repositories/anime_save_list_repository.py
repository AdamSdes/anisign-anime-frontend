from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete ,distinct
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from app.db.models import Anime , Genre
import logging
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from dateutil import parser
from sqlalchemy import select, or_ , func
from sqlalchemy.sql import text
from uuid import UUID
from app.db.models import AnimeSaveList
from app.schemas.anime_schemas import AnimeSaveListUpdate
from fastapi import HTTPException


class AnimeSaveListRepository():
    def __init__(self, db : AsyncSession):
        self.db = db
        
    async def create_anime_save_list(self, list_name: str, current_user_id: UUID) -> AnimeSaveList:
        anime_list = AnimeSaveList(list_name=list_name, user_id=current_user_id, anime_ids=[])
        self.db.add(anime_list)
        await self.db.commit()
        await self.db.refresh(anime_list)
        return anime_list
    
    async def delete_anime_list(self, list_name: str, current_user_id: UUID) -> AnimeSaveList:
        query = delete(AnimeSaveList)
        await self.db.execute(query)
        await self.db.commit()
        return "All lists deleted successfully"
    
    async def get_anime_save_list_by_name(self, list_name: str,current_user_id:UUID) -> AnimeSaveList:
        anime_list = await self.db.execute(select(AnimeSaveList).where(AnimeSaveList.list_name == list_name,AnimeSaveList.user_id == current_user_id))
        anime_list = anime_list.scalars().first()
        if not anime_list:
            raise HTTPException(status_code=404, detail="List not found")
        return anime_list
    
    async def put_anime_id_in_list(self, list_name: str, anime_id: str, current_user_id: UUID):
        query = select(AnimeSaveList).where(AnimeSaveList.list_name == list_name, AnimeSaveList.user_id == current_user_id)
        anime_list = await self.db.execute(query)
        anime_list = anime_list.scalars().first()
        if anime_id in anime_list.anime_ids:
            raise HTTPException(status_code=400, detail="Anime already in list")
        
        anime_list.anime_ids = list(set(anime_list.anime_ids + [anime_id]))
        await self.db.commit()
        await self.db.refresh(anime_list)
        
        return anime_list

    async def delete_anime_id_from_list(self, list_name: str, anime_id: str, current_user_id: UUID):
        query = select(AnimeSaveList).where(AnimeSaveList.list_name == list_name, AnimeSaveList.user_id == current_user_id)
        anime_list = await self.db.execute(query)
        anime_list = anime_list.scalars().first()
        if anime_id not in anime_list.anime_ids:
            raise HTTPException(status_code=400, detail="Anime not in list")
        
        anime_list.anime_ids = list(set(anime_list.anime_ids) - {anime_id})
        await self.db.commit()
        await self.db.refresh(anime_list)
        
        return anime_list
            