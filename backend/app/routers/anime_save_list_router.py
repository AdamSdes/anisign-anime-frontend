from fastapi import APIRouter, Depends, Path, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from app.db.models import User
from app.services.anime_save_list_service import AnimeSaveListService
from uuid import UUID
from typing import List
from app.services.user_service import get_current_user_from_token
from app.utils.utils import ANIME_SAVE_LIST_ENUM
from app.schemas.anime_schemas import AnimeSaveListResponse, AnimeSaveListStatusResponse

anime_save_list_router = APIRouter()


@anime_save_list_router.post("/create-anime-save-list/{list_name}", response_model=AnimeSaveListResponse)
async def create_anime_save_list(
    list_name: str = Path(..., description="Select list name", enum=ANIME_SAVE_LIST_ENUM),
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user_from_token),
):
    """Create a new anime save list for the user."""
    service = AnimeSaveListService(db)
    result = await service.create_anime_save_list(list_name, current_user.id)
    return result


@anime_save_list_router.delete("/delete-anime-list-all")
async def delete_anime_list(
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user_from_token),
):
    """Delete all anime lists for the current user."""
    service = AnimeSaveListService(db)
    await service.delete_anime_list(current_user.id)
    return {"message": "All anime lists deleted successfully"}


@anime_save_list_router.get("/get-all-anime-lists/user/{user_id}", response_model=List[AnimeSaveListResponse])
async def get_all_anime_save_lists(
    user_id: UUID,
    db: AsyncSession = Depends(get_session),
):
    """Get all anime save lists for a user (all 5 lists in one request)."""
    service = AnimeSaveListService(db)
    result = await service.get_all_anime_save_lists(user_id)
    return result


@anime_save_list_router.get("/get-anime-list-by-name/{list_name}/user/{user_id}", response_model=AnimeSaveListResponse)
async def get_anime_save_list_by_name(
    user_id: UUID,
    list_name: str = Path(..., description="Select list name", enum=ANIME_SAVE_LIST_ENUM),
    db: AsyncSession = Depends(get_session),
):
    """Get a specific anime list by name for a user."""
    service = AnimeSaveListService(db)
    result = await service.get_anime_save_list_by_name(list_name, user_id)
    return result


@anime_save_list_router.get("/get-anime-list-status/{anime_id}", response_model=AnimeSaveListStatusResponse)
async def get_anime_list_status(
    anime_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user_from_token),
):
    """Check which list contains a specific anime for the current user."""
    service = AnimeSaveListService(db)
    result = await service.get_anime_list_status(anime_id, current_user.id)
    if result:
        return AnimeSaveListStatusResponse(anime_id=anime_id, list_name=result.list_name, in_list=True)
    return AnimeSaveListStatusResponse(anime_id=anime_id, list_name=None, in_list=False)


@anime_save_list_router.put("/put-anime-id-in-list/{list_name}", response_model=AnimeSaveListResponse)
async def put_anime_id_in_list(
    anime_id: str,
    list_name: str = Path(..., description="Select list name", enum=ANIME_SAVE_LIST_ENUM),
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user_from_token),
):
    """Add an anime to a specific list. Automatically removes it from other lists."""
    service = AnimeSaveListService(db)
    result = await service.put_anime_id_in_list(list_name, anime_id, current_user.id)
    return result


@anime_save_list_router.delete("/delete-anime-id-from-list", response_model=AnimeSaveListResponse)
async def delete_anime_id_from_list(
    anime_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user_from_token),
):
    """Remove an anime from any list the current user has it in."""
    service = AnimeSaveListService(db)
    result = await service.delete_anime_id_from_list(anime_id, current_user.id)
    return result