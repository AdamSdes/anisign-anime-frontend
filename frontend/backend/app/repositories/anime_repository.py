from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete ,distinct
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from app.db.models import Anime , Genre , AnimeCurrentEpisode
from sqlalchemy import select, func, Integer
from fastapi import Depends ,Query ,Path ,Body
from typing import List
import logging
from datetime import datetime
from sqlalchemy import select, desc, asc, func, Integer
from sqlalchemy.exc import SQLAlchemyError
from dateutil import parser
from sqlalchemy import select, or_ , func ,case, extract
from sqlalchemy.sql import text
from uuid import UUID


class AnimeRepository():
    def __init__(self, db : AsyncSession):
        self.db = db
        
    async def get_anime_list(self, page: int, limit: int):
        query = select(Anime).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        anime_list = result.scalars().all()

        count_query = select(func.count()).select_from(Anime)
        count_result = await self.db.execute(count_query)
        total_count = count_result.scalar()
        
        return {"total_count": total_count, "anime_list": anime_list}

    
    async def get_anime_by_id(self, anime_id: str):
        anime = await self.db.execute(select(Anime).where(Anime.anime_id == anime_id))
        anime = anime.scalars().first()
        return anime
    
    async def get_anime_by_id_uuid(self, anime_id: UUID):
        anime = await self.db.execute(select(Anime).where(Anime.id == anime_id))
        anime = anime.scalars().first()
        return anime
        
    async def save_anime_list(self, animes: list):
        for anime in animes:
            try:
                # Convert date strings to datetime.date objects
                date_fields = ['createdAt', 'updatedAt', 'nextEpisodeAt']
                for field in date_fields:
                    if anime[field]:
                        try:
                            anime[field] = datetime.fromisoformat(anime[field]).replace(tzinfo=None)
                        except Exception as e:
                            logging.error(f"Error parsing date for field {field} in anime {anime}: {e}")
                            anime[field] = None
                            
                date_fields_without_time = ['aired_on', 'released_on']
                for field in date_fields_without_time:
                    if anime[field]:
                        try:
                            anime[field] = parser.parse(anime[field]).date()
                        except Exception as e:
                            logging.error(f"Error parsing date for field {field} in anime {anime}: {e}")
                            anime[field] = None
                
                # related_anime_ids = [related['anime']['id'] for related in anime.get('related', []) if 'anime' in related]
                # anime['related_anime_ids'] = related_anime_ids
                
                anime_instance = Anime(**anime)
                self.db.add(anime_instance)
                await self.db.commit()
                await self.db.refresh(anime_instance)
                
            except IntegrityError as e:
                await self.db.rollback()
                logging.error(f"Duplicate entry for anime: {anime.get('english', 'unknown')}, Error: {e}")
                continue  # Skip the duplicate entry and continue with the next one
            except SQLAlchemyError as e:
                await self.db.rollback()
                logging.error(f"Error while saving anime: {anime}, Error: {e}")
                return f"Error while saving anime list: {e}"
        
        return {'message': "Anime list saved successfully"}
    
    
    
    async def delete_all(self):
        query = delete(Anime)
        await self.db.execute(query)
        await self.db.commit()
        return "All anime deleted successfully"
    
    async def get_anime_by_name(self, name: str):
        query = select(Anime).where(
            or_(
                Anime.english.ilike(f'%{name}%'),
                Anime.russian.ilike(f'%{name}%')
            )
        )
        result = await self.db.execute(query)
        anime_list = result.scalars().all()

        total_count = len(anime_list)

        return {"total_count": total_count, "anime_list": anime_list}
    
    async def get_anime_by_genre(self, genre_id: str, page: int, limit: int):
        count_query = select(func.count()).select_from(Anime).where(
            Anime.genre_ids.contains([genre_id])
        )
        total_count_result = await self.db.execute(count_query)
        total_count = total_count_result.scalar()
        
        query = select(Anime).where(
            Anime.genre_ids.contains([genre_id])
        ).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        anime_list = result.scalars().all()

        return {"total_count": total_count, "anime_list": anime_list}
    
    async def get_anime_list_by_kind(self, kind: str, page: int, limit: int):
        count_query = select(func.count()).select_from(Anime).where(Anime.kind == kind)
        total_count_result = await self.db.execute(count_query)
        total_count = total_count_result.scalar()
        
        query = select(Anime).where(Anime.kind == kind).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        anime_list = result.scalars().all()
        
        return {"total_count": total_count, "anime_list": anime_list}
    
    async def get_anime_list_by_rating(self, rating: str, page: int, limit: int):
        count_query = select(func.count()).select_from(Anime).where(Anime.rating == rating)
        total_count_result = await self.db.execute(count_query)
        total_count = total_count_result.scalar()
        
        query = select(Anime).where(Anime.rating == rating).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        anime_list = result.scalars().all()
        
        return {"total_count": total_count, "anime_list": anime_list}
    
    async def get_anime_by_year_range(self, start_year: int, end_year: int):
        query = select(Anime).where(
            func.cast(func.split_part(Anime.season, '_', 2), Integer) >= start_year,
            func.cast(func.split_part(Anime.season, '_', 2), Integer) <= end_year
        )
        result = await self.db.execute(query)
        animes = result.scalars().all()
        count = len(animes)
        return {"total_count": count, "anime_list": animes}
    
    async def get_anime_list_by_status(self, status: str, page: int, limit: int):
        count_query = select(func.count()).select_from(Anime).where(Anime.status == status)
        total_count_result = await self.db.execute(count_query)
        total_count = total_count_result.scalar()
        
        query = select(Anime).where(Anime.status == status).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        anime_list = result.scalars().all()
        
        return {"total_count": total_count, "anime_list": anime_list}
    
    async def get_all_kinds(self):
        query = select(distinct(Anime.kind))
        result = await self.db.execute(query)
        kinds = result.scalars().all()
        return kinds
    
    async def get_all_ratings(self):
        query = select(distinct(Anime.rating))
        result = await self.db.execute(query)
        ratings = result.scalars().all()
        return ratings
    
    async def get_anime_list_filtered(self, genre_ids_list: list, kind: str = None, rating: str = None, status: str = None, start_year: int = None, end_year: int = None, page: int = 1, limit: int = 10, sort_by: str = None, sort_order: str = 'asc', filter_by_score: bool = False, filter_by_date: bool = False, filter_by_name: bool = False):
        query = select(Anime)
        
        if genre_ids_list:
            for genre_id in genre_ids_list:
                query = query.where(Anime.genre_ids.contains([genre_id]))
        if kind:
            query = query.where(Anime.kind == kind)
        if rating:
            query = query.where(Anime.rating == rating)
        if status:
            query = query.where(Anime.status == status)
        if start_year and end_year:
            query = query.where(
                extract('year', Anime.aired_on) >= start_year,
                extract('year', Anime.aired_on) <= end_year
            )
        if filter_by_score:
            query = query.order_by(Anime.score.desc())
        if filter_by_date:
            query = query.order_by(Anime.aired_on.desc())
        if filter_by_name:
            query = query.order_by(
                case(
                    (Anime.russian.op('~')('^[А-Яа-я]'), 0),  # Russian letters first
                    else_=1
                ),
                Anime.russian
            )
        
        if sort_by:
            if sort_order == 'desc':
                query = query.order_by(desc(getattr(Anime, sort_by)))
            else:
                query = query.order_by(asc(getattr(Anime, sort_by)))
                
        total_query = select(func.count()).select_from(query.alias())
        total_result = await self.db.execute(total_query)
        total_count = total_result.scalar()
        
        query = query.offset((page - 1) * limit).limit(limit)
        result = await self.db.execute(query)
        anime_list = result.scalars().all()
        
        return {"total_count": total_count, "anime_list": anime_list}

    async def get_current_episode(self, anime_id: str, user_id: UUID):
        query = select(AnimeCurrentEpisode).where(
            AnimeCurrentEpisode.anime_id == anime_id,
            AnimeCurrentEpisode.user_id == user_id
        )
        result = await self.db.execute(query)
        current_episode = result.scalars().first()
        if not current_episode:
            current_episode = AnimeCurrentEpisode(anime_id=anime_id, user_id=user_id, current_episode=1)
            self.db.add(current_episode)
            await self.db.commit()
            return current_episode
        return current_episode
    
    async def update_current_episode(self, anime_id: UUID, user_id: UUID, episode_number: int):
        current_episode_obj = await self.get_current_episode(anime_id, user_id)
        if current_episode_obj:
            current_episode_obj.current_episode = episode_number
            await self.db.commit()
            return {"message": "Current episode updated successfully"}
        
        current_episode = AnimeCurrentEpisode(anime_id=anime_id, user_id=user_id, current_episode=episode_number)
        self.db.add(current_episode)
        await self.db.commit()
        return {"message": "Current episode created successfully"}