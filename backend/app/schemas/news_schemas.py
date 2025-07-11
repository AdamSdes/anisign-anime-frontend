from typing import Optional
from pydantic import BaseModel, Field, validator
from uuid import UUID

class NewsBaseSchema(BaseModel):
    title: str
    text: str
    img: str
    date: str
    link: str
