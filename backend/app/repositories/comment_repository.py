from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Anime, Comment, User
from uuid import UUID
from typing import Optional
from fastapi import HTTPException, status

class CommentRepository:
    
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def create_comment_for_anime(self, anime_id: UUID, text: str, user_id: str, comment_type: str, reply_to_comment_id: Optional[UUID] = None):
        comment = Comment(anime_id=anime_id, text=text, user_id=user_id, comment_type=comment_type, likes=0, reply_to_comment_id=reply_to_comment_id)
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
    
    async def like_comment(self, comment_id: UUID, user_id: UUID):
        comment = await self.db.execute(select(Comment).where(Comment.id == comment_id))
        comment = comment.scalars().first()
        
        if comment.user_liked_list is None:
            comment.user_liked_list = []
    
        if user_id in comment.user_liked_list:
            return {"message": "User has already liked this comment"}
        
        if comment.likes is None:
            comment.likes = 0
        comment.likes += 1
        comment.user_liked_list = list(set(comment.user_liked_list + [user_id]))
        
        await self.db.commit()
        return {"message": "Comment liked successfully"}
    
    
    async def dislike_comment(self, comment_id: UUID, user_id: UUID):
        comment = await self.db.execute(select(Comment).where(Comment.id == comment_id))
        comment = comment.scalars().first()
        if comment.likes is None:
            comment.likes = 0
    
        if comment.user_liked_list is None:
            comment.user_liked_list = []
        
        if user_id not in list(comment.user_liked_list):
            return {"message": "User has not liked this comment or already disliked"}
        
        if comment.likes > 0:
            comment.likes -= 1
            comment.user_liked_list = list(filter(lambda x: x != user_id, comment.user_liked_list))
            await self.db.commit()
            
        return {"message": "Comment disliked successfully"}
    
    async def delete_reply_to_comment(self, comment_id: UUID):
        comments = await self.db.execute(select(Comment).where(Comment.reply_to_comment_id == comment_id))
        comments = comments.scalars().all()
        for comment in comments:
            await self.db.delete(comment)
        await self.db.commit()
        return {"message": "Reply to comment deleted successfully"}