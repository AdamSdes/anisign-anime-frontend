from fastapi import APIRouter
import logging
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from fastapi import APIRouter, HTTPException, status
from app.services.user_service import UserService
from app.schemas.user_schemas import SignUpRequestSchema
from uuid import UUID
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.auth.jwt_auth import JWTAuth
from app.schemas.auth_schemas import Token , RefreshToken
from app.db.models import User
from app.services.user_service import get_current_user_from_token
from fastapi import Response



user_router = APIRouter()

@user_router.get("/")
async def get_all_users(page: int = 1, limit: int = 5,db: AsyncSession = Depends(get_session)):
    service = UserService(db)
    users = await service.get_all_users(page, limit)
    return users

@user_router.get("/get-user/{user_id}")
async def get_user_by_id(user_id: UUID, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)): 
    service = UserService(db)
    check = await service.check_user_permission_by_id(current_user.id, user_id)
    if check:
        user = await service.get_user_by_id(user_id)
        return user
    

@user_router.get("/get-user-by-username/{username}")
async def get_user_by_username(username: str, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    service = UserService(db)
    current_username = current_user.username
    check = await service.check_user_permission_by_name(current_username, username)
    if check:
        user = await service.get_user_by_username(username)
        return user

@user_router.post("/create-user")
async def create_user(user_data: SignUpRequestSchema, db: AsyncSession = Depends(get_session)):
    service = UserService(db)
    user = await service.create_user(user_data)
    return user
    

@user_router.put("/update-user{user_id}")
async def update_user(user_id: int):
    pass

@user_router.delete("/delete-all")
async def delete_all_users():
    pass

@user_router.delete("/delete-user/{user_id}")
async def delete_user(user_id: int):
    pass

auth_router = APIRouter()

@auth_router.post("/token")
async def login_for_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response, db: AsyncSession = Depends(get_session)):
    auth = JWTAuth()
    service = UserService(db)
    user = await service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token = await auth.create_access_token({"sub": user.username})
    refresh_token = await auth.create_refresh_token({"sub": user.username})
    refresh_token = f"{refresh_token}"
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True)
    return {"access_token": access_token, "refresh_token": "set in cookie", "token_type": "bearer"}

@auth_router.post("/refresh-token")
async def refresh_token(refresh_token: RefreshToken, db: AsyncSession = Depends(get_session)) -> Token:
    auth = JWTAuth()
    access_token = await auth.refresh_access_token(refresh_token.refresh_token)
    return access_token

@user_router.post("/set_refresh_token")
async def set_refresh_token(refresh_token: RefreshToken, response: Response, db: AsyncSession = Depends(get_session)):
    refresh_token = f"{refresh_token.refresh_token}"
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True)
    return {"message": "Refresh token встановлено"}
