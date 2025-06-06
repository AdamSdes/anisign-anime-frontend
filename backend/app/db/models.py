from sqlalchemy import Column, Integer, String , Text, Date, Boolean , Float, DateTime, func
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.base_models import BaseTable
from sqlalchemy import Table, Column, String, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Enum
from sqlalchemy.dialects.postgresql import ENUM
import datetime


# genre_ids = Column(ARRAY(Integer))
class UserStatusEnum(Enum):
    USER = "user"
    ADMIN = "admin"
    PRO = "pro"
    
class CommentTypeEnum(Enum):
    COMMENT = "comment"
    REPLY = "reply"

# Create the ENUM type with a name
user_status_enum = ENUM(UserStatusEnum.USER, UserStatusEnum.ADMIN, UserStatusEnum.PRO, name='userstatusenum')
comment_type_enum = ENUM(CommentTypeEnum.COMMENT, CommentTypeEnum.REPLY, name='commenttypeenum')

class User(BaseTable):
    __tablename__ = 'users'
    username = Column(String, index=True, unique=True, nullable=False)
    email = Column(String, index=True, unique=True, nullable=False)
    nickname = Column(String, index=True, unique=True)
    password = Column(String, index=True ,nullable=False)
    user_avatar = Column(String, index=True, nullable=True)
    user_banner = Column(String, index=True, nullable=True)
    status = Column(user_status_enum, index=True, nullable=True)
    user_comments = relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    
    user_view_history = relationship('ViewHistory', back_populates='user', cascade='all, delete-orphan')
    friend_list = relationship('UserFriendList',back_populates='user',cascade='all, delete-orphan')
    current_episodes = relationship('AnimeCurrentEpisode', back_populates='user', cascade='all, delete-orphan')


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
    aired_on = Column(DateTime, index=True, nullable=True)
    released_on = Column(DateTime, index=True, nullable=True)
    season = Column(String, index=True, nullable=True)
    poster_url = Column(String, index=True, nullable=False) # original 
    createdAt = Column(DateTime, index=True, nullable=True)
    updatedAt = Column(DateTime, index=True, nullable=True)
    nextEpisodeAt = Column(DateTime, index=True, nullable=True)
    isCensored = Column(Boolean, index=True, nullable=True)
    screenshots = Column(ARRAY(Text))
    description = Column(String, index=True, nullable=True)
    genre_ids = Column(ARRAY(Text))
    related_anime_ids = Column(ARRAY(Text), nullable=True)
    related_anime_texts = Column(ARRAY(Text), nullable=True)
    character_ids = Column(ARRAY(Text), nullable=True)
    
    comments = relationship('Comment', back_populates='anime', cascade='all, delete-orphan')
    current_episodes = relationship('AnimeCurrentEpisode', back_populates='anime', cascade='all, delete-orphan')
    # genres = relationship('Genre', secondary=anime_genre, back_populates='animes')
    
    
class Genre(BaseTable):
    __tablename__ = 'genre'
    genre_id = Column(String, index=True, unique=True, nullable=False)
    name = Column(String, index=True, unique=True, nullable=False)
    russian = Column(String, index=True, unique=True, nullable=True)
    
    # animes = relationship('Anime', secondary=anime_genre, back_populates='genres')
    

class Character(BaseTable):
    __tablename__ = 'character'
    character_id = Column(String, index=True, unique=True, nullable=False)
    name = Column(String, index=True, unique=True, nullable=False)
    russian = Column(String, index=True, unique=True, nullable=False)
    japanese = Column(String, index=True, nullable=True)
    poster_url = Column(String, index=True, nullable=False) # original
    description = Column(Text, nullable=True)
    
class AnimeSaveList(BaseTable):
    __tablename__ = 'anime_save_list'
    list_name = Column(String, index=True, nullable=False)
    anime_ids = Column(ARRAY(Text))
    user_id = Column(UUID)
    
class Comment(BaseTable):
    __tablename__ = 'comment'
    user_id = Column(UUID, ForeignKey('users.id', ondelete='CASCADE'))
    anime_id = Column(UUID, ForeignKey('anime.id', ondelete='CASCADE'))
    text = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    likes = Column(Integer, index=True, nullable=True)
    user_liked_list = Column(ARRAY(UUID), nullable=True)
    comment_type = Column(comment_type_enum, index=True, nullable=True)
    reply_to_comment_id = Column(UUID, nullable=True)
    id_of_anime = Column(String, index=True, nullable=False)  # This is the original anime ID from the source
    
    anime = relationship('Anime', back_populates='comments')
    user = relationship('User', back_populates='user_comments')

class ViewHistory(BaseTable):
    __tablename__ = 'view_history'
    user_id = Column(UUID, ForeignKey('users.id', ondelete='CASCADE'))
    anime_id_list = Column(ARRAY(UUID))
    last_watched_at = Column(DateTime, server_default=func.now(), nullable=False)
    is_finished = Column(Boolean, index=True, nullable=True)
    
    user = relationship('User', back_populates='user_view_history')
    

class AnimeCurrentEpisode(BaseTable):
    __tablename__ = 'anime_current_episode'
    anime_id = Column(UUID, ForeignKey('anime.id', ondelete='CASCADE'), primary_key=True)
    user_id = Column(UUID, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    current_episode = Column(Integer, index=True, nullable=False)
    last_updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    anime = relationship('Anime', back_populates='current_episodes')
    user = relationship('User', back_populates='current_episodes')
    
class UserFriendList(BaseTable):
    __tablename__ = 'user_friend_list'
    user_id = Column(UUID, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    friends_list = Column(ARRAY(UUID))
    
    user = relationship('User', back_populates='friend_list')
    

    

    
    