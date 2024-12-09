from app.utils.utils import verify_password
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta , timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi.security import HTTPBearer
from fastapi import Depends
from fastapi import HTTPException
from typing import Annotated
from app.core.config import Settings
from app.schemas.auth_schemas import Token , RefreshToken
import logging
from fastapi import Response


settings = Settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = HTTPBearer()


class JWTAuth():
    def __init__(self):
        self.secret_key = settings.secret_key
        self.algorithm = settings.jwt_algorithm
        self.access_token_expire_minutes = settings.access_token_expire_minutes
        self.refresh_token_expire_days = settings.refresh_token_expire_days
        self.refresh_token_expire_days_long = settings.refresh_token_expire_days_long

    async def create_access_token(self, data: dict) -> Token:
        to_encode = data.copy()
        if self.access_token_expire_minutes:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    async def create_refresh_token(self, data: dict, remember_me: bool) -> Token:
        to_encode = data.copy()
        if remember_me == True:
            expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days_long)
        else:
            expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    async def refresh_access_token(self, refresh_token: str) -> Token:
        try:
            payload = jwt.decode(refresh_token, self.secret_key, algorithms=[self.algorithm])
            exp = payload.get("exp")
            if exp is None or datetime.fromtimestamp(exp, timezone.utc) < datetime.now(timezone.utc):
                raise JWTError("Refresh Token has expired")
            
            username: str = payload.get("sub")
            if username is None:
                raise JWTError()
            new_access_token = await self.create_access_token({"sub": username})
            new_refresh_token = await self.create_refresh_token({"sub": username})
            return Token(access_token=new_access_token, refresh_token=new_refresh_token, token_type="bearer")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    