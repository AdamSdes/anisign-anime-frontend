from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from sqlalchemy.future import select
from app.db.models import User
from app.schemas.user_schemas import SignUpRequestSchema
from app.core.config import Settings
from app.db.models import User
from app.schemas.user_schemas import SignUpRequestSchema
from jose import jwt, JWTError
from app.db.postgresql_connection import get_session
from app.auth.jwt_auth import oauth2_scheme
from datetime import datetime
from app.schemas.auth_schemas import TokenData
from fastapi import HTTPException
from app.schemas.user_schemas import UserSchema
from uuid import UUID

settings = Settings()


class UserRepository():
    def __init__(self, db : AsyncSession):
        self.db = db
    
    async def get_user_by_id(self, user_id: UUID) -> User:
        user = await self.db.execute(select(User).where(User.id == user_id))
        user = user.scalars().first()
        return user
    
    async def get_user_by_name(self, name: str) -> dict:
        query = select(User).where(
                User.username.ilike(f'%{name}%')
        )
        result = await self.db.execute(query)
        user_list = result.scalars().all()

        total_count = len(user_list)

        return {"total_count": total_count, "user_list": user_list}
        
    async def get_all_users(self, page: int, limit: int):
        query = select(User).limit(limit).offset((page - 1) * limit)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_user_by_username(self, username: str) -> User:
        user = await self.db.execute(select(User).where(User.username == username))
        user = user.scalars().first()
        return user
    
    async def create_user(self, user_data: dict) -> User:
        user = User(**user_data)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def update_avatar(self, user_id: UUID, avatar_url: str):
        user = await self.get_user_by_id(user_id)
        if user:
            user.user_avatar = avatar_url
            await self.db.commit()
            return {"message": "Avatar updated successfully"}
        return {"message": "User not found"}
        
    async def update_banner(self, user_id: UUID, banner_url: str):
        user = await self.get_user_by_id(user_id)
        if user:
            user.user_banner = banner_url
            await self.db.commit()
            return {"message": "banner updated successfully"}
        return {"message": "User not found"}
    
    async def update_status(self, user_id: UUID, status: str):
        user = await self.get_user_by_id(user_id)
        if user:
            user.status = status
            await self.db.commit()
            return {"message": "Status updated successfully"}
        return {"message": "User not found"}
    
    async def update_nickname(self, user_id: UUID, nickname: str):
        user = await self.get_user_by_id(user_id)
        if user:
            user.nickname = nickname
            await self.db.commit()
            return {"message": "Nickname updated successfully"}
        return {"message": "User not found"}
    
    async def update_password(self, user_id: UUID, password: str):
        user = await self.get_user_by_id(user_id)
        if user:
            user.password = password
            await self.db.commit()
            return {"message": "Password updated successfully"}
        return {"message": "User not found"}
    
    
