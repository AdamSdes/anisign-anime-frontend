from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from app.db.models import Anime , Genre
import logging
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from dateutil import parser


class AnimeRepository():
    def __init__(self, db : AsyncSession):
        self.db = db
        
    async def get_anime_list(self, page: int, limit: int):
        query = select(Anime).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        return result.scalars().all()
    
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
