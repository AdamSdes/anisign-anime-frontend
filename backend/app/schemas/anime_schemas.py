from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID


class AnimeShort(BaseModel):
    anime_id: str
    english: str
    russian: str
    poster_url: str
    score: Optional[float] = None

    class Config:
        from_attributes = True


class AnimeSaveListResponse(BaseModel):
    id: UUID
    list_name: str
    anime_ids: List[str]
    animes: List[AnimeShort] = []
    user_id: UUID

    class Config:
        from_attributes = True


class AnimeSaveListStatusResponse(BaseModel):
    anime_id: str
    list_name: Optional[str] = None
    in_list: bool

    class Config:
        from_attributes = True


class AnimeSaveListUpdate(BaseModel):
    anime_ids: List[str]

    class Config:
        from_attributes = True


class ChangePasswordRequest(BaseModel):
    password: str
    new_password: str
    confirm_password: str