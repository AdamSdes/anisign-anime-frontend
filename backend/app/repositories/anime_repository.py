from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from sqlalchemy.future import select

class AnimeRepository():
    def __init__(self, db : AsyncSession):
        self.db = db
