from app.utils.utils import verify_password
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi.security import HTTPBearer
from fastapi import Depends
from fastapi import HTTPException
from typing import Annotated
from app.core.config import Settings
from app.schemas.auth_schemas import Token , RefreshToken
import logging

settings = Settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = HTTPBearer()


class JWTAuth():
    def __init__(self):
        self.secret_key = settings.secret_key
        self.algorithm = settings.jwt_algorithm
        self.access_token_expire_minutes = settings.access_token_expire_minutes
        self.refresh_token_expire_days = settings.refresh_token_expire_days

    async def create_access_token(self, data: dict) -> Token:
        to_encode = data.copy()
        if self.access_token_expire_minutes:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    async def create_refresh_token(self, data: dict) -> Token:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    async def verify_token(self, token: str, token_type: str = "access") -> dict:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            if token_type == "access":
                if datetime.utcnow() > datetime.fromtimestamp(payload.get("exp")):
                    raise HTTPException(status_code=401, detail="Access token expired")
            elif token_type == "refresh":
                if datetime.utcnow() > datetime.fromtimestamp(payload.get("exp")):
                    raise HTTPException(status_code=401, detail="Refresh token expired")
            return payload
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

    async def refresh_access_token(self, refresh_token: RefreshToken) -> Token:
        refresh_token_dict = refresh_token.dict()
        refresh_token = refresh_token_dict.get("refresh_token")
        payload = await self.verify_token(refresh_token, token_type="refresh")
        new_access_token = await self.create_access_token(data={"sub": payload.get("sub")})
        return new_access_token