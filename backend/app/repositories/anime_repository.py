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
        
    async def save_anime_list(self, animes: list):
        for anime in animes:
            try:
                # Convert date strings to datetime.date objects
                date_fields = ['aired_on', 'released_on', 'createdAt', 'updatedAt', 'nextEpisodeAt']
                for field in date_fields:
                    if anime[field]:
                        try:
                            anime[field] = parser.parse(anime[field]).date()
                        except (ValueError, parser.ParserError) as e:
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
#
# class Anime(BaseTable):
    # __tablename__ = 'anime'
    # title = Column(String, index=True, unique=True, nullable=False)
    # description = Column(String, index=True)
    # anime_images = Column(ARRAY(Text))
    # rating = Column(Integer, index=True)
    # category = Column(ARRAY(String), index=True)
    # year = Column(Integer, index=True)
    # created_at = Column(String, index=True)
    # last_season = Column(Integer, index=True)
    # last_episode = Column(Integer, index=True)
    # episodes_count = Column(Integer, index=True)
    # imdb_id = Column(String, index=True)
    # shikimori_id = Column(String, index=True)
    # quality = Column(String, index=True)
    # other_title = Column(String, index=True)
    # link = Column(String, index=True)
    # id_kodik = Column(String, index=True)
