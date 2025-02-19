from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.schemas.user_schemas import SignUpRequestSchema , UserDetailSchema
from app.db.models import User
from fastapi import HTTPException, status
from app.utils.utils import verify_password , hash_password
from typing import List, Optional
from app.repositories.user_repository import UserRepository
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user_schemas import SignUpRequestSchema, UserDetailSchema ,UserSchema
import bcrypt
import logging
from app.db.postgresql_connection import get_session 
from fastapi import HTTPException , File, UploadFile
from app.db.models import User ,UserStatusEnum
from uuid import UUID
from app.utils.utils import verify_password, hash_password
from typing import Annotated
from app.auth.jwt_auth import oauth2_scheme
from fastapi import Depends
from app.core.config import Settings
from app.schemas.auth_schemas import TokenData
from jose import JWTError
from app.repositories.anime_save_list_repository import AnimeSaveListRepository
from app.repositories.viewhistory_repository import ViewHistoryRepository
from datetime import datetime
from fastapi import status
import os
import shutil
from fastapi.responses import FileResponse


settings = Settings()

UPLOAD_DIR = "./uploads/avatars/"
UPLOAD_DIR_BANNER = "./uploads/banners/"


async def get_current_user_from_token(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_session)) -> UserDetailSchema:
    try:
        payload = jwt.decode(token.credentials,key=settings.secret_key,
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
        self.list_repository = AnimeSaveListRepository(db)
        self.viewhistory_repository = ViewHistoryRepository(db)
        
    async def check_user_permission_by_name(self, current_username: str, username: str):
        if current_username == username:
            return True
        else:
            raise HTTPException(status_code=403, detail="You are not authorized to access this user")
        
    async def check_user_permission_by_id(self, current_user_id: UUID, user_id: UUID):
        if current_user_id == user_id:
            return True
        else:
            raise HTTPException(status_code=403, detail="You are not authorized to access this user")
        
    async def get_user_by_id(self, user_id: int) -> UserSchema:
        user = await self.user_repository.get_user_by_id(user_id)
        user = UserSchema(**user.__dict__)
        return user
    
    async def get_user_by_name(self, name: str) -> dict:
        users_list = await self.user_repository.get_user_by_name(name)
        return users_list
    
    async def get_user_by_username(self, username: str) -> UserSchema:    
        user = await self.user_repository.get_user_by_username(username)
        user = UserSchema(**user.__dict__)
        return user

    async def get_all_users(self, page: int, limit: int):
        return await self.user_repository.get_all_users(page, limit)
    
    async def create_user(self, user_data: SignUpRequestSchema) -> UserDetailSchema:
        user_data_dict = user_data.dict()
        password = user_data_dict["password"]
        confirm_password = user_data_dict["confirm_password"]
        user_data_dict["nickname"] = user_data_dict["username"]
        # Перевірка, чи паролі однакові
        if password != confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        
        user_data_dict.pop("confirm_password")
        check = await self.user_repository.get_user_by_username(user_data_dict["username"])
        if not check:
            user_data_dict["password"] = await hash_password(password)
            user_data_dict["status"] = UserStatusEnum.USER
            user = await self.user_repository.create_user(user_data_dict)
            user = UserDetailSchema(**user.__dict__)
            user_id = user.id
            try:
                lists = await self.list_repository.initialize_anime_save_lists(user_id)
            except:
                raise HTTPException(status_code=400, detail="Error creating anime lists")
            try:
                history = await self.viewhistory_repository.initialize_anime_history(user_id)
            except:
                return HTTPException(status_code=400, detail="Error creating view history")
        else:
            raise HTTPException(status_code=400, detail="User already exists")
        
    async def authenticate_user(self, username: str, password: str) -> UserDetailSchema:
        user = await self.user_repository.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        current_password = user.password
        check = await verify_password(password, current_password)
        if not check:
            raise HTTPException(status_code=400, detail="incorrect password")
        return user
    
    async def update_avatar(self, user_id: UUID, file: UploadFile = File(...)):
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
        file_location = f"{UPLOAD_DIR}{user_id}.png"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        user = self.user_repository.get_user_by_id(user_id)
        if user:
            result = await self.user_repository.update_avatar(user_id, file_location)
            return result
        else:
            raise HTTPException(status_code=404, detail="User not found")
        
    async def update_status(self, user_id: UUID, status: str = "pro"):
        user = self.user_repository.get_user_by_id(user_id)
        if user:
            result = await self.user_repository.update_status(user_id, status)
            return result
        else:
            raise HTTPException(status_code=404, detail="User not found")
        
        
    async def update_banner(self, user_id: UUID, file: UploadFile = File(...)):
        if not os.path.exists(UPLOAD_DIR_BANNER):
            os.makedirs(UPLOAD_DIR_BANNER)
        file_location = f"{UPLOAD_DIR_BANNER}{user_id}.png"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        user = self.user_repository.get_user_by_id(user_id)
        if user:
            result = await self.user_repository.update_banner(user_id, file_location)
            return result
        else:
            raise HTTPException(status_code=404, detail="User not found")


    async def get_avatar(self, user_id: UUID):
        file_location = f"{UPLOAD_DIR}{user_id}.png"
        if not os.path.exists(file_location):
            raise HTTPException(status_code=404, detail="Avatar not found")
        return FileResponse(file_location)
    
    async def get_banner(self, user_id: UUID):
        file_location = f"{UPLOAD_DIR_BANNER}{user_id}.png"
        if not os.path.exists(file_location):
            raise HTTPException(status_code=404, detail="Banner not found")
        return FileResponse(file_location)

    async def change_nickname(self, user_id: UUID, nickname: str):
        user = self.user_repository.get_user_by_id(user_id)
        if user:
            result = await self.user_repository.update_nickname(user_id, nickname)
            return result
        else:
            raise HTTPException(status_code=404, detail="User not found")
        
    async def change_password(self, user_id: UUID, password: str, new_password: str, confirm_password: str):
        user = await self.user_repository.get_user_by_id(user_id)
        if user:
            current_password = user.password
            check = await verify_password(password, current_password)
            if not check:
                raise HTTPException(status_code=400, detail="incorrect password")
            if new_password != confirm_password:
                raise HTTPException(status_code=400, detail="Passwords do not match")
            new_password = await hash_password(new_password)
            result = await self.user_repository.update_password(user_id, new_password)
            return result
        else:
            raise HTTPException(status_code=404, detail="User not found")
        
    