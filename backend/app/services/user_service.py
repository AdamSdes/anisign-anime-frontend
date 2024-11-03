from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.schemas.user_schemas import SignUpRequestSchema
from app.db.models import User

class UserService:
    def __init__(self, db: AsyncSession):
        self.user_repository = UserRepository(db)

    async def get_all_users(self, page: int, limit: int):
        return await self.user_repository.get_all_users(page, limit)
    
    async def create_user(self, user_data: SignUpRequestSchema) -> User:
        return await self.user_repository.create_user(user_data)
        
        
