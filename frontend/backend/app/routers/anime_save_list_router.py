from fastapi import APIRouter
from fastapi import Depends ,Query ,Path
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql_connection import get_session
from app.db.models import User
from fastapi import APIRouter, HTTPException, status
from app.services.anime_save_list_service import AnimeSaveListService
from uuid import UUID
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.services.user_service import get_current_user_from_token
from app.utils.utils import ANIME_SAVE_LIST_ENUM

anime_save_list_router = APIRouter()

# @anime_save_list_router.post("/save-anime-to-list/{list_name}")
# async def save_anime_to_list(anime_id: str,list_name: str = Path(..., description="Select list name", enum=ANIME_SAVE_LIST_ENUM), db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
#     """
#     Save anime to list.

#     Save anime to the user's list.

#     - **list_name**: The name of the list to save the anime to.
#     - **anime_id**: The ID of the anime to save to the list.

#     Returns the saved anime details.
#     """
#     service = AnimeSaveListService(db)
#     result = await service.save_anime_to_list(list_name, anime_id, current_user.id)
#     return result

@anime_save_list_router.post("/create-anime-save-list/{list_name}")
async def create_anime_save_list(list_name: str = Path(..., description="Select list name", enum=ANIME_SAVE_LIST_ENUM), db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    """
    Create anime save list.

    Create a new anime save list for the user.

    - **list_name**: The name of the list to create.

    Returns the created anime list details.
    """
    service = AnimeSaveListService(db)
    result = await service.create_anime_save_list(list_name, current_user.id)
    return result

@anime_save_list_router.delete("/delete-anime-list-all")
async def delete_anime_list(db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    """
    Delete anime list.

    Delete an anime list.

    - **list_name**: The name of the list to delete.

    Returns the deleted anime list details.
    """
    service = AnimeSaveListService(db)
    result = await service.delete_anime_list(current_user.id)
    return result

@anime_save_list_router.get("/get-anime-list-by-name/{list_name}/user/{user_id}")
async def get_anime_save_list_by_name(user_id: UUID, list_name: str = Path(..., description="Select list name", enum=ANIME_SAVE_LIST_ENUM), db: AsyncSession = Depends(get_session)):
    """
    Get anime list by name.

    Retrieve anime list by name.

    - **list_name**: The name of the list to retrieve.

    Returns the anime list details.
    """
    service = AnimeSaveListService(db)
    result = await service.get_anime_save_list_by_name(list_name, user_id)
    return result

@anime_save_list_router.put("/put_anime_id_in_list/{list_name}")
async def put_anime_id_in_list(anime_id: str,list_name: str = Path(..., description="Select list name", enum=ANIME_SAVE_LIST_ENUM), db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    """
    Put anime id in list.

    Put anime id in the user's list.

    - **list_name**: The name of the list to put the anime id in.
    - **anime_id**: The ID of the anime to put in the list.

    Returns the put anime id details.
    """
    service = AnimeSaveListService(db)
    result = await service.put_anime_id_in_list(list_name, anime_id, current_user.id)
    return result

@anime_save_list_router.delete("/delete-anime-id-from-list")
async def delete_anime_id_from_list(anime_id: str, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user_from_token)):
    """
    Delete anime id from list.

    Delete anime id from the user's list.

    - **list_name**: The name of the list to delete the anime id from.
    - **anime_id**: The ID of the anime to delete from the list.

    Returns the deleted anime id details.
    """
    service = AnimeSaveListService(db)
    result = await service.delete_anime_id_from_list(anime_id, current_user.id)
    return result