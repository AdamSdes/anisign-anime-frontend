from fastapi import APIRouter
import logging
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from fastapi import APIRouter, HTTPException, status
from app.services.user_friends_service import UserFriendsService
from app.services.anime_service import AnimeService
from app.services.anime_save_list_service import AnimeSaveListService
from app.schemas.user_schemas import SignUpRequestSchema ,UserDetailSchema
from uuid import UUID
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.auth.jwt_auth import JWTAuth
from fastapi import HTTPException , File, UploadFile
from app.schemas.auth_schemas import Token , RefreshToken
from app.db.models import User
from app.services.user_service import get_current_user_from_token
from app.repositories.anime_save_list_repository import  AnimeSaveListRepository
from fastapi import Response, Request

user_friends_router = APIRouter()

@user_friends_router.get("/get-friends/{user_id}")
async def get_friends(user_id: UUID, db: AsyncSession = Depends(get_session)):
    service = UserFriendsService(db)
    friends = await service.get_friends(user_id)
    return friends

@user_friends_router.post("/invite-to-friends/{receiver_id}/to/{sender_id}")
async def invite_friend(receiver_id: UUID, sender_id: UUID, db: AsyncSession = Depends(get_session)):
    service = UserFriendsService(db)
    result = await service.invite_friend(receiver_id, sender_id)
    return result


@user_friends_router.post("/accept-friend-request-from/{sender_id}/to/{my_id}")
async def accept_friend_request(sender_id: UUID, my_id: UUID, db: AsyncSession = Depends(get_session)):
    service = UserFriendsService(db)
    result = await service.accept_friend_request(sender_id, my_id)
    return result

@user_friends_router.get("/get-in-friend-requests/{user_id}")
async def get_in_friend_requests(user_id: UUID, db: AsyncSession = Depends(get_session)):
    service = UserFriendsService(db)
    friend_requests = await service.get_in_friend_requests(user_id)
    return friend_requests

@user_friends_router.get("/get-out-friend-requests/{user_id}")
async def get_out_friend_requests(user_id: UUID, db: AsyncSession = Depends(get_session)):
    service = UserFriendsService(db)
    friend_requests = await service.get_out_friend_requests(user_id)
    return friend_requests

@user_friends_router.delete("/delete-friend/{friend_id}/from/{user_id}")
async def delete_friend(friend_id: UUID, user_id: UUID, db: AsyncSession = Depends(get_session)):
    service = UserFriendsService(db)
    result = await service.delete_friend(friend_id, user_id)
    return result