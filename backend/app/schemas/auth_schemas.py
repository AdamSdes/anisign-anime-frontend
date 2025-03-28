from sqlalchemy import Column, String
from pydantic import BaseModel
from uuid import UUID


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    sub: str | None = None
    exp: int | None = None
    
class RefreshToken(BaseModel):
    refresh_token: str