from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Genre

class GenreRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_genre_if_not_exists(self, genre_data):
        query = select(Genre).filter_by(genre_id=genre_data["genre_id"])
        result = await self.db.execute(query)
        genre = result.scalars().first()
        if not genre:
            genre = Genre(**genre_data)
            self.db.add(genre)
            await self.db.commit()
            await self.db.refresh(genre)
        return genre
    
    async def get_genres_list(self):
        query = select(Genre)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_genre_by_id(self, genre_id: str):
        genre = await self.db.execute(select(Genre).where(Genre.genre_id == genre_id))
        genre = genre.scalars().first()
        return genre