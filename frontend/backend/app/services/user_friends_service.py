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
from app.repositories.user_friends_repository import UserFriendsRepository
from jose import JWTError
from app.repositories.anime_save_list_repository import AnimeSaveListRepository
from app.repositories.viewhistory_repository import ViewHistoryRepository
from datetime import datetime
from fastapi import status
import os
import shutil
from fastapi.responses import FileResponse


settings = Settings()

class UserFriendsService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_friends_repository = UserFriendsRepository(db)
        
    async def get_in_friend_requests(self, user_id: UUID):
        # Fetch friend requests where the user is the receiver
        friend_requests = await self.user_friends_repository.get_in_friend_requests(user_id)
        if not friend_requests:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No friend requests found.")
        return friend_requests
    
    async def get_out_friend_requests(self, user_id: UUID):
        # Fetch friend requests where the user is the sender
        friend_requests = await self.user_friends_repository.get_out_friend_requests(user_id)
        if not friend_requests:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No friend requests found.")
        return friend_requests
    
    
    async def get_friends(self, user_id: UUID):
        friends = await self.user_friends_repository.get_friends(user_id)
        return friends
    
    async def invite_friend(self, friend_id: UUID, user_id: UUID):
        # Check if the user is already friends with the invited friend
        existing_friendship = await self.user_friends_repository.get_friends(user_id)
        if friend_id in existing_friendship:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You are already friends with this user.")

        # Check if the invitation already exists
        # existing_invitation = await self.user_friends_repository.get_invitation(friend_id, user_id)
        # if existing_invitation:
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invitation already sent.")
        
        result = await self.user_friends_repository.invite_friend(friend_id, user_id)
        return result
    
    
    async def accept_friend_request(self, sender_id: UUID, receiver_id: UUID):
        # Check if the friend request exists
        friend_requests = await self.user_friends_repository.get_in_friend_requests(receiver_id)
        for request in friend_requests:
            if request.sender_id == sender_id:
                # Accept the friend request
                result = await self.user_friends_repository.add_friend(sender_id, receiver_id)
                if result:
                    return {"message": "Friend added successfully"}
    
    async def add_friend(self, friend_id: UUID, user_id: UUID):
        result = await self.user_friends_repository.add_friend(friend_id, user_id)
        if result:
            return {"message": "Friend added successfully"}
    
    async def delete_friend(self, friend_id: UUID, user_id: UUID):
        result = await self.user_friends_repository.delete_friend(friend_id, user_id)
        return result