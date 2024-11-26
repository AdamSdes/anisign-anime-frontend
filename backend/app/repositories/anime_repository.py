from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from app.db.models import Anime

class AnimeRepository():
    def __init__(self, db : AsyncSession):
        self.db = db
        
    async def save_anime_list(self, items):
        for item in items:
            title = item.get("title", "")
            existing_anime = await self.db.execute(select(Anime).filter_by(title=title))
            existing_anime = existing_anime.scalars().first()
            
            if existing_anime is None:
                anime = Anime(
                    title=title,
                    description=item.get("description", ""),
                    anime_images=item.get("screenshots", []),
                    rating=item.get("rating", 0),
                    year=item.get("year", 0),
                    created_at=item.get("created_at", ""),
                    last_season=item.get("last_season", 0),
                    last_episode=item.get("last_episode", 0),
                    episodes_count=item.get("episodes_count", 0),
                    imdb_id=item.get("imdb_id", ""),
                    shikimori_id=item.get("shikimori_id", ""),
                    quality=item.get("quality", ""),
                    other_title=item.get("other_title", ""),
                    link=item.get("link", ""),
                    id_kodik=item.get("id", "")
                )
                self.db.add(anime)
            else:
                # Optionally, update the existing record if needed
                pass
        
        try:
            await self.db.commit()
        except IntegrityError as error:
            await self.db.rollback()
            raise error

        return "Anime list saved successfully"
    
    
    
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
