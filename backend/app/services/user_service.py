from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.schemas.user_schemas import SignUpRequestSchema , UserDetailSchema
from app.db.models import User
from fastapi import HTTPException, status
from app.utils.utils import verify_password , hash_password
from typing import List, Optional
from app.repositories.user_repository import UserRepository
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user_schemas import SignUpRequestSchema, UserDetailSchema
import bcrypt
import logging
from app.db.postgresql_connection import get_session 
from fastapi import HTTPException
from app.db.models import User
from uuid import UUID
from app.utils.utils import verify_password, hash_password
from typing import Annotated
from app.auth.jwt_auth import oauth2_scheme
from jose import jwt
from fastapi import Depends
from app.core.config import Settings
from app.schemas.auth_schemas import TokenData
from jose import JWTError
from datetime import datetime
from fastapi import status


settings = Settings()


async def get_current_user_from_token(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_session)) -> UserDetailSchema:
    try:
        payload = jwt.decode(token.credentials,
                             algorithms=[settings.jwt_algorithm])
        username: str = payload.get("sub")
        exp: int = payload.get("exp")
        if not username:
            raise HTTPException(
                status_code=401, detail="No Username found in token")

        token_data = TokenData(sub=username, exp=exp)
    except JWTError:
        raise HTTPException(
            status_code=401, detail="Token has expired")
    old_user = await UserRepository(db).get_user_by_username(username=username)
    if not old_user:
        return HTTPException(status_code=404, detail="User not found")
    else:
        exp_date = datetime.fromtimestamp(token_data.exp)
        current_date = datetime.now()
        if current_date > exp_date:
            raise HTTPException(
                status_code=401, detail="Token has expired")
        return old_user
class UserService:
    def __init__(self, db: AsyncSession):
        self.user_repository = UserRepository(db)
        
    async def get_user_by_id(self, user_id: int) -> User:
        user = await self.user_repository.get_user_by_id(user_id)
        return user

    async def get_all_users(self, page: int, limit: int):
        return await self.user_repository.get_all_users(page, limit)
    
    async def get_user_by_username(self, username: str) -> User:
        user = await self.user_repository.get_user_by_username(username)
        return user
    
    async def create_user(self, user_data: SignUpRequestSchema) -> User:
        hashed_password = await hash_password(user_data.password)
        user_data_dict = user_data.dict()
        user_data_dict.pop('confirm_password', None)
        user_data_dict['password'] = hashed_password
        user = await self.user_repository.create_user(user_data_dict)
        return user
        
    async def authenticate_user(self, username: str, password: str) -> UserDetailSchema:
        user = await self.user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        entered_password = password
        current_password = user.password
        check = await verify_password(entered_password, current_password)
        if not check:
            raise HTTPException(status_code=400, detail="incorrect password")
        return user
    
    # async def create_user_from_token(self, email: str) -> UserDetailSchema:
    #     password_pref = 'auth0' + email.split("@")[0]
    #     password = password_pref + "test"
    #     new_user_data = {
    #         "username": email.split("@")[0],
    #         "email": email,
    #         "password": password,
    #         "confirm_password": password,
    #         "first_name": email.split("@")[0],
    #         "last_name": "yourlatname",
    #     }
    #     check_user_by_username = await self.get_user_by_username(new_user_data["username"])
    #     if not check_user_by_username:
    #         created_user = await self.create_user(SignUpRequestSchema(**new_user_data))
    #     else:
    #         new_user_data["username"] = new_user_data["username"] + "auth0"
    #         created_user = await self.create_user(SignUpRequestSchema(**new_user_data))
    #     return created_user
        
        
