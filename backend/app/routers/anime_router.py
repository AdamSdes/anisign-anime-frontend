from fastapi import APIRouter
from fastapi import Depends ,Query ,Path ,Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from fastapi import APIRouter, HTTPException, status
from app.services.user_service import UserService
from app.services.anime_service import AnimeService
from app.schemas.user_schemas import SignUpRequestSchema ,UserDetailSchema
from uuid import UUID
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.services.user_service import get_current_user_from_token
from app.utils.utils import KIND_ENUM ,RATING_ENUM, STATUS_ENUM


anime_router = APIRouter()

@anime_router.get("/save-anime-list-in-db",)
async def save_anime_list_in_db(db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.save_anime_list_in_db()
    return result

@anime_router.get("/name/{name}")
async def get_anime_by_name(name: str, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_anime_by_name(name)
    return result

@anime_router.get("/genre/{genre}")
async def get_anime_by_genre(genre: str, page: int = 1, limit: int = 10, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_anime_by_genre(genre, page, limit)
    return result

@anime_router.get("/id/{anime_id}")
async def get_anime_by_id(anime_id: str, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_anime_by_id(anime_id)
    return result

@anime_router.delete("/delete-all-anime")
async def delete_all_anime(db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.delete_all()
    return {"detail": f"{result}"}

@anime_router.get("/get-anime-list")
async def get_anime_list(page: int = 1, limit: int = 10, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_anime_list(page, limit)
    return result

@anime_router.get("/get-anime-list-by-kind/{kind}")
async def get_anime_list_by_kind(kind: str = Path(..., description="Select kind", enum=KIND_ENUM), page: int = 1, limit: int = 10, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_anime_list_by_kind(kind, page, limit)
    return result

@anime_router.get("/get-anime-list-by-rating/{rating}")
async def get_anime_list_by_rating(rating: str = Path(..., description="Select rating", enum=RATING_ENUM), page: int = 1, limit: int = 10, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_anime_list_by_rating(rating, page, limit)
    return result

@anime_router.get("/get-anime-list-by-status/{status}")
async def get_anime_list_by_status(status: str = Path(..., description="Select status", enum=STATUS_ENUM), page: int = 1, limit: int = 10, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_anime_list_by_status(status, page, limit)
    return result

@anime_router.get("/anime/by-year-range")
async def get_anime_by_year_range(start_year: int, end_year: int, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    return await service.get_anime_by_year_range(start_year, end_year)

@anime_router.get("/get-anime-list-filtered")
async def get_anime_list_filtered(genre_id: List[str] = Query(None, description="List of genre IDs"), kind: str = None, rating: str = None, status: str = None, start_year: int = None, end_year: int = None, page: int = 1, limit: int = 10, sort_by: str = None, sort_order: str = 'asc', filter_by_score: bool = False, filter_by_date: bool = False, filter_by_name: bool = False, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    return await service.get_anime_list_filtered(genre_id, kind, rating, status, start_year, end_year, page, limit, sort_by, sort_order, filter_by_score, filter_by_date, filter_by_name)

@anime_router.get("/kinds")
async def get_all_kinds(db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_all_kinds()
    return result

@anime_router.get("/statuses")
async def get_all_statuses(db: AsyncSession = Depends(get_session)):
    return STATUS_ENUM

@anime_router.get("/ratings")
async def get_all_ratings(db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_all_ratings()
    return result


@anime_router.get("/current-episode/{anime_id}/for-user/{user_id}")
async def get_current_episode(anime_id: UUID, user_id: UUID, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.get_current_episode(anime_id, user_id)
    return result

@anime_router.post("/update-current-episode/{anime_id}/for-user/{user_id}")
async def update_current_episode(anime_id: UUID, episode_number: int, user_id: UUID, db: AsyncSession = Depends(get_session)):
    service = AnimeService(db)
    result = await service.update_current_episode(anime_id, user_id, episode_number)
    return result

    
