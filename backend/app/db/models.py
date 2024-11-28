from sqlalchemy import Column, Integer, String ,ARRAY, Text
from app.db.base_models import BaseTable


class User(BaseTable):
    __tablename__ = 'users'
    username = Column(String, index=True, unique=True, nullable=False)
    nickname = Column(String, index=True, unique=True)
    password = Column(String, index=True ,nullable=False)
    user_avatar = Column(String, index=True, nullable=True)

    

class Anime(BaseTable):
    __tablename__ = 'anime'
    title = Column(String, index=True, unique=True, nullable=False)
    description = Column(String, index=True)
    anime_images = Column(ARRAY(Text))
    rating = Column(Integer, index=True)
    # category = Column(ARRAY(Text))
    year = Column(Integer, index=True)
    created_at = Column(String, index=True)
    last_season = Column(Integer, index=True)
    last_episode = Column(Integer, index=True)
    episodes_count = Column(Integer, index=True)
    imdb_id = Column(String, index=True)
    shikimori_id = Column(String, index=True)
    quality = Column(String, index=True)
    other_title = Column(String, index=True)
    link = Column(String, index=True)
    id_kodik = Column(String, index=True)
    