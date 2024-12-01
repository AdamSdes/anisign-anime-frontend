from sqlalchemy import Column, Integer, String ,ARRAY
from app.db.base_models import BaseTable


class User(BaseTable):
    __tablename__ = 'users'
    username = Column(String, index=True, unique=True, nullable=False)
    password = Column(String, index=True ,nullable=False)
    user_avatar = Column(String, index=True, nullable=True)

    

class Anime(BaseTable):
    __tablename__ = 'anime'
    title = Column(String, index=True, unique=True, nullable=False)
    description = Column(String, index=True)
    anime_image = Column(String, index=True)
    rating = Column(Integer, index=True)
    category = Column(ARRAY(String), index=True)
    