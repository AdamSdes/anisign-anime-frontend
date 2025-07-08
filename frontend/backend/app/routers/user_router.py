from fastapi import APIRouter
import logging
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from fastapi import APIRouter, HTTPException, status
from app.services.user_service import UserService
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



user_router = APIRouter()

@user_router.get("/")
async def get_all_users(page: int = 1, limit: int = 5,db: AsyncSession = Depends(get_session)):
    """
    Get all users.

    Retrieve users details will work if you are admin).

    Returns the users details.
    """
    service = UserService(db)
    users = await service.get_all_users(page, limit)
    return users

@user_router.get("/get-user/{user_id}")
async def get_user_by_id(user_id: UUID, db: AsyncSession = Depends(get_session)):
    #, current_user: User = Depends(get_current_user_from_token)
    """
    Get a user by ID.

    Retrieve user details by user ID if the current user has permission.

    - **user_id**: The ID of the user to retrieve.

    Returns the user's details if permission is granted.
    """
    service = UserService(db)
    # check = await service.check_user_permission_by_id(current_user.id, user_id)
    # if check:
    user = await service.get_user_by_id(user_id)
    return user

@user_router.get("/name/{name}")
async def get_user_by_name(name: str, db: AsyncSession = Depends(get_session)):
    service = UserService(db)
    result = await service.get_user_by_name(name)
    return result
    

@user_router.get("/get-user-by-username/{username}")
async def get_user_by_username(username: str, db: AsyncSession = Depends(get_session)):
    # , current_user: User = Depends(get_current_user_from_token)
    """
    Get a user by username.

    Retrieve user details by username if the current user has permission.

    - **username**: The username of the user to retrieve.

    Returns the user's details if permission is granted.
    """
    service = UserService(db)
    # current_username = current_user.username
    # check = await service.check_user_permission_by_name(current_username, username)
    # if check:
    user = await service.get_user_by_username(username)
    return user

@user_router.post("/create-user")
async def create_user(user_data: SignUpRequestSchema, db: AsyncSession = Depends(get_session)):
    """
    Create a new user.
    
    Insert User data and create user from it.

    Returns the created user's details.
    """
    service = UserService(db)
    user = await service.create_user(user_data)
    auth = JWTAuth()
    access_token = await auth.create_access_token({"sub": user.username})
    return {"user": user, "access_token": access_token}

@user_router.put("/update-my-nickname")
async def update_nickname(nickname: str, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    """
    Update the nickname for the current user.

    - **nickname**: The new nickname for the user.
    - **current_user**: The current authenticated user.

    Returns a success message.
    """
    service = UserService(db)
    result = await service.change_nickname(current_user.id, nickname)
    return result
    

@user_router.put("/update-my-avatar")
async def upload_avatar(file: UploadFile, db : AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    """
    Update the current user avatar.

    Upload and update the avatar for the current user.

    - **file**: The avatar file to upload.
    - **current_user**: The current authenticated user.

    Returns a success message.
    """
    service = UserService(db)
    result = await service.update_avatar(current_user.id, file)
    return result

@user_router.put("/update-my-banner")
async def upload_avatar(file: UploadFile, db : AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    """
    Update the current user banner.

    Upload and update the avatar for the current user.

    - **file**: The avatar file to upload.
    - **current_user**: The current authenticated user.

    Returns a success message.
    """
    service = UserService(db)
    result = await service.update_banner(current_user.id, file)
    return result

@user_router.get("/get-user-banner")
async def get_my_banner(user_id: UUID, db: AsyncSession = Depends(get_session)):
    """
    Get the current user's banner.

    Retrieve the banner for the current user.

    - **db**: The database session.
    - **current_user**: The current authenticated user.

    Returns the banner file.
    """
    service = UserService(db)
    banner = await service.get_banner(user_id)
    return banner

@user_router.get("/update-status")
async def update_status(user_id: UUID,db: AsyncSession = Depends(get_session)):
    """
    Update the status of the user.

    This endpoint is for administrative purposes and should be used with caution.
    """
    service = UserService(db)
    result = await service.update_status(user_id)
    return result

@user_router.get("/get-user-avatar")
async def get_my_avatar(user_id: UUID,db: AsyncSession = Depends(get_session)):
    """
    Get the current user's avatar.

    Retrieve the avatar for the current user.

    - **db**: The database session.
    - **current_user**: The current authenticated user.

    Returns the avatar file.
    """
    service = UserService(db)
    avatar = await service.get_avatar(user_id)
    return avatar

@user_router.post("/change-my-password")
async def change_password(password: str, new_password: str, confirm_password: str,db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    """
    Change the current user's password.

    Update the password for the current user.
    """
    service = UserService(db)
    result = await service.change_password(current_user.id,password, new_password, confirm_password)
    return result
    

@user_router.delete("/delete-all")
async def delete_all_users(db: AsyncSession = Depends(get_session)):
    """
    Delete all users from the database.

    This endpoint is for administrative purposes and should be used with caution.
    """
    service = UserService(db)
    result = await service.delete_all_users()

@user_router.delete("/delete-user/{user_id}")
async def delete_user(user_id: int):
    """
    Delete user by id from the database.

    This endpoint is for administrative purposes and should be used with caution.
    """
    pass






auth_router = APIRouter()

@auth_router.post("/token")
async def login_for_token(remember_me: bool, form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response, db: AsyncSession = Depends(get_session)):
    auth = JWTAuth()
    service = UserService(db)
    user = await service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = await auth.create_access_token({"sub": user.username})
    refresh_token = await auth.create_refresh_token({"sub": user.username}, remember_me)
    refresh_token = f"{refresh_token}"
    # response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False)
    return {"user": user,"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@auth_router.get("/refresh-token")
async def refresh_token(remember_me: bool, refresh_token: str, request: Request, response: Response, db: AsyncSession = Depends(get_session)):
    auth = JWTAuth()
    # refresh_token = request.cookies.get("refresh_token")
    # if not refresh_token:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Refresh token not found in cookies",
    #     )
    access_token = await auth.refresh_access_token(refresh_token, remember_me)
    refresh_token =  access_token.refresh_token
    # response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True)
    return {"access_token": access_token.access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="refresh_token")
    response.delete_cookie(key="access_token")
    return {"detail": "Logged out successfully"}

@auth_router.get("/get-cookies")
async def get_cookies(request: Request):
    cookies = request.cookies
    return cookies

    

