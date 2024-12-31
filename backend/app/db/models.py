from sqlalchemy import Column, Integer, String ,ARRAY, Text, Date, Boolean , Float
from app.db.base_models import BaseTable


class User(BaseTable):
    __tablename__ = 'users'
    username = Column(String, index=True, unique=True, nullable=False)
    nickname = Column(String, index=True, unique=True)
    password = Column(String, index=True ,nullable=False)
    user_avatar = Column(String, index=True, nullable=True)


class Anime(BaseTable):
    __tablename__ = 'anime'
    anime_id = Column(String, index=True, unique=True, nullable=False)
    english = Column(String, index=True, unique=True, nullable=False)
    russian = Column(String, index=True, unique=True, nullable=False)
    kind = Column(String, index=True, nullable=False)
    rating = Column(String, index=True, nullable=True)
    score = Column(Float, index=True, nullable=True)
    status = Column(String, index=True, nullable=False)
    episodes = Column(Integer, index=True, nullable=False)
    episodesAired = Column(Integer, index=True, nullable=True)
    duration = Column(Integer, index=True, nullable=True)
    aired_on = Column(Date, index=True, nullable=True)
    released_on = Column(Date, index=True, nullable=True)
    season = Column(String, index=True, nullable=True)
    poster_url = Column(String, index=True, nullable=False) # original 
    createdAt = Column(Date, index=True, nullable=True)
    updatedAt = Column(Date, index=True, nullable=True)
    nextEpisodeAt = Column(Date, index=True, nullable=True)
    isCensored = Column(Boolean, index=True, nullable=True)
    screenshots = Column(ARRAY(Text))
    description = Column(String, index=True, nullable=True)
    
    
    
    
    
    
      # genre
    # studio
    # character roles
    #  related (anime)

    
    