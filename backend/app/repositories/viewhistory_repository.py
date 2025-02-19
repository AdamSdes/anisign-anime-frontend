from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Anime, Comment, User , ViewHistory
from uuid import UUID
from typing import Optional
from fastapi import HTTPException, status

class ViewHistoryRepository:
    
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def get_view_history_of_user(self, user_id: UUID):
        view_history = await self.db.execute(select(ViewHistory).where(ViewHistory.user_id == user_id))
        view_history = view_history.scalars().all()
        return view_history
    
    async def initialize_anime_history(self, user_id: UUID):
        history = ViewHistory(user_id=user_id, anime_id_list=[])
        self.db.add(history)
        await self.db.commit()
        await self.db.refresh(history)
        return history
    
    async def add_anime_to_view_history_of_user(self, anime_id: UUID, user_id: UUID):
        history = await self.db.execute(select(ViewHistory).where(ViewHistory.user_id == user_id))
        history = history.scalars().first()
        if not history:
            history = await self.initialize_anime_history(user_id)
        history.anime_id_list = list(history.anime_id_list) + [anime_id]
        return history
        