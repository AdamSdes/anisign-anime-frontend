from sqlalchemy.ext.asyncio import AsyncSession

class AnimeRepository():
    def __init__(self, db : AsyncSession):
        self.db = db
