from typing import List, Optional
from sqlalchemy import Column, String
from pydantic import BaseModel
from uuid import UUID

class AnimeSaveListUpdate(BaseModel):
    anime_ids: List[str]

    class Config:
        orm_mode = True