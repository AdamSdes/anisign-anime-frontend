from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Anime, Comment, User
from uuid import UUID

class CommentRepository:
    
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def create_comment_for_anime(self, anime_id: UUID, text: str, user_id: str):
        comment = Comment(anime_id=anime_id, text=text, user_id=user_id)
        self.db.add(comment)
        await self.db.commit()
        await self.db.refresh(comment)
        return comment
    
    async def get_all_comments_for_anime(self, anime_id: UUID):
        comments = await self.db.execute(select(Comment).where(Comment.anime_id == anime_id))
        return comments.scalars().all()