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

user_router = APIRouter()

@user_router.get("/")
async def get_all_users(page: int = 1, limit: int = 5,db: AsyncSession = Depends(get_session)):
    service = UserService(db)
    users = await service.get_all_users(page, limit)
    return users

@user_router.get("/get-user/{user_id}")
async def get_user_by_id(user_id: int):
    pass

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

