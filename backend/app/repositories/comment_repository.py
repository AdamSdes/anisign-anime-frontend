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
    
    async def check_user_permission_to_comment(self, user_id: UUID, comment_id: UUID):
        comment = await self.db.execute(select(Comment).where(Comment.id == comment_id))
        comment = comment.scalars().first()
        if comment.user_id == user_id:
            return True
        else:
            return False
    
    async def get_comment_by_id(self, comment_id: UUID):
        comment = await self.db.execute(select(Comment).where(Comment.id == comment_id))
        comment = comment.scalars().first()
        return comment
    
    async def get_all_comments_for_anime(self, anime_id: UUID):
        comments = await self.db.execute(
            select(Comment).where(Comment.anime_id == anime_id).order_by(Comment.created_at.desc())
        )
        return comments.scalars().all()
    
    async def delete_comment(self, comment_id: UUID):
        comment = await self.db.execute(select(Comment).where(Comment.id == comment_id))
        comment = comment.scalars().first()
        if comment:
            await self.db.delete(comment)
            await self.db.commit()
            return {"message": "Comment deleted successfully"}
        else:
            return {"message": "Comment not found"}
    
    async def update_comment(self, comment_id: UUID, text: str):
        comment = await self.db.execute(select(Comment).where(Comment.id == comment_id))
        comment = comment.scalars().first()
        comment.text = text
        await self.db.commit()
        return {"message": "Comment updated successfully"}