from typing import Optional
from pydantic import BaseModel, Field, validator
from uuid import UUID



class UserBaseSchema(BaseModel):
    username: Optional[str] = Field(..., min_length=6,
                                    description="Username must be at least 6 characters long")
    email: Optional[str] = Field(..., description="Email must be a valid email address")


class UserSchema(UserBaseSchema):
    email: Optional[str]
    user_avatar: Optional[str]
    user_banner: Optional[str]
    nickname: Optional[str]
    id: UUID
    
class UserAvatar(UserBaseSchema):
    user_avatar: Optional[str]

    
    
class SignUpRequestSchema(UserBaseSchema):
    password: str = Field(..., min_length=8,
                          description="Password must be at least 8 characters long")
    confirm_password: Optional[str] = Field(
        None, min_length=8, description="Password must be at least 8 characters long")

    # @validator('confirm_password')
    # def passwords_match(cls, v, values, **kwargs):
    #     if 'password' in values and v != values['password']:
    #         raise ValueError("Passwords do not match")
    #     return v

class UserDetailSchema(UserBaseSchema):
    id: UUID
