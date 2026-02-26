from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from sqlalchemy.future import select
from uuid import UUID
from typing import Optional, List
from app.db.models import AnimeSaveList


class AnimeSaveListRepository():
    def __init__(self, db: AsyncSession):
        self.db = db

    async def initialize_anime_save_lists(self, user_id: UUID):
        list_names = ["Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"]
        for list_name in list_names:
            anime_list = AnimeSaveList(list_name=list_name, user_id=user_id, anime_ids=[])
            self.db.add(anime_list)
        await self.db.commit()
        return True

    async def create_anime_save_list(self, list_name: str, current_user_id: UUID) -> AnimeSaveList:
        anime_list = AnimeSaveList(list_name=list_name, user_id=current_user_id, anime_ids=[])
        self.db.add(anime_list)
        await self.db.commit()
        await self.db.refresh(anime_list)
        return anime_list

    async def delete_anime_list(self, user_id: UUID) -> bool:
        query = delete(AnimeSaveList).where(AnimeSaveList.user_id == user_id)
        await self.db.execute(query)
        await self.db.commit()
        return True

    async def get_anime_save_list_by_name(self, list_name: str, user_id: UUID) -> Optional[AnimeSaveList]:
        anime_list = await self.db.execute(
            select(AnimeSaveList).where(
                AnimeSaveList.list_name == list_name,
                AnimeSaveList.user_id == user_id
            )
        )
        return anime_list.scalars().first()

    async def get_all_anime_save_lists(self, user_id: UUID) -> List[AnimeSaveList]:
        result = await self.db.execute(
            select(AnimeSaveList).where(AnimeSaveList.user_id == user_id)
        )
        return result.scalars().all()

    async def get_anime_list_status(self, anime_id: str, user_id: UUID) -> Optional[AnimeSaveList]:
        """Find which list contains the given anime_id for the user."""
        result = await self.db.execute(
            select(AnimeSaveList).where(AnimeSaveList.user_id == user_id)
        )
        anime_lists = result.scalars().all()
        for anime_list in anime_lists:
            if anime_list.anime_ids and anime_id in anime_list.anime_ids:
                return anime_list
        return None

    async def put_anime_id_in_list(self, list_name: str, anime_id: str, current_user_id: UUID) -> Optional[AnimeSaveList]:
        # Remove anime from any existing list first
        query = select(AnimeSaveList).where(AnimeSaveList.user_id == current_user_id)
        result = await self.db.execute(query)
        anime_lists = result.scalars().all()

        for anime_list in anime_lists:
            if anime_list.anime_ids and anime_id in anime_list.anime_ids:
                anime_list.anime_ids = [aid for aid in anime_list.anime_ids if aid != anime_id]

        # Add anime to the target list
        query = select(AnimeSaveList).where(
            AnimeSaveList.list_name == list_name,
            AnimeSaveList.user_id == current_user_id
        )
        result = await self.db.execute(query)
        target_list = result.scalars().first()
        if not target_list:
            return None

        target_list.anime_ids = (target_list.anime_ids or []) + [anime_id]
        await self.db.commit()
        await self.db.refresh(target_list)
        return target_list

    async def delete_anime_id_from_list(self, anime_id: str, current_user_id: UUID) -> Optional[AnimeSaveList]:
        query = select(AnimeSaveList).where(AnimeSaveList.user_id == current_user_id)
        result = await self.db.execute(query)
        anime_lists = result.scalars().all()

        updated_list = None
        for anime_list in anime_lists:
            if anime_list.anime_ids and anime_id in anime_list.anime_ids:
                anime_list.anime_ids = [aid for aid in anime_list.anime_ids if aid != anime_id]
                updated_list = anime_list

        if updated_list:
            await self.db.commit()
            await self.db.refresh(updated_list)

        return updated_list
            