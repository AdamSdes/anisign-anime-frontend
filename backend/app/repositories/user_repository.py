from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from sqlalchemy.future import select
from app.db.models import User
from app.schemas.user_schemas import SignUpRequestSchema

class UserRepository():
    def __init__(self, db : AsyncSession):
        self.db = db
        
    async def get_all_users(self, page: int, limit: int):
        query = select(User).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def create_user(self, user_data: SignUpRequestSchema) -> User:
        user_dict = user_data.dict()
        user = User(**user_dict)
        self.db.add(user)
        await self.db.commit()
        return user
