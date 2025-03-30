from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Anime, Comment, User , ViewHistory, UserFriendList
from uuid import UUID
from typing import Optional
from fastapi import HTTPException, status

class UserFriendsRepository:
    
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def get_friends(self, user_id: UUID):
        friends_list = await self.db.execute(select(UserFriendList).where(UserFriendList.user_id == user_id))
        friends_list = friends_list.scalars().all()
        if not friends_list:
            friends_list = UserFriendList(user_id=user_id, friends_list=[])
            self.db.add(friends_list)
            await self.db.commit()
            await self.db.refresh(friends_list)
        return friends_list
    
    async def add_friend(self, friend_id: UUID, user_id: UUID):
        
        check_if_already_friend = await self.check_if_already_friend(friend_id, user_id)
        if check_if_already_friend:
            raise HTTPException(status_code=400, detail="Friend already added")
        
        friends_list_first = await self.db.execute(select(UserFriendList).where(UserFriendList.user_id == user_id))
        friends_list_first = friends_list_first.scalars().first()
        if not friends_list_first:
            friends_list_first = UserFriendList(user_id=user_id, friends_list=[])
            self.db.add(friends_list_first)
            await self.db.commit()
            await self.db.refresh(friends_list_first)
            
        friends_list_second = await self.db.execute(select(UserFriendList).where(UserFriendList.user_id == friend_id))
        friends_list_second = friends_list_second.scalars().first()
        if not friends_list_second:
            friends_list_second = UserFriendList(user_id=friend_id, friends_list=[])
            self.db.add(friends_list_second)
            await self.db.commit()
            await self.db.refresh(friends_list_second)
            
        
        friends_list_first.friends_list = list(friends_list_first.friends_list) + [friend_id]
        friends_list_second.friends_list = list(friends_list_second.friends_list) + [user_id]
        await self.db.commit()
        await self.db.refresh(friends_list_first)
        
        return friends_list_first
        
    async def delete_friend(self, friend_id: UUID, user_id: UUID):
        # Fetch the first user's friend list
        result = await self.db.execute(select(UserFriendList).where(UserFriendList.user_id == user_id))
        friend_list_first = result.scalars().first()
        if not friend_list_first:
            raise HTTPException(status_code=404, detail="Friend list not found")
        friend_list_first.friends_list = [friend for friend in friend_list_first.friends_list if friend != friend_id]
        await self.db.commit()
        await self.db.refresh(friend_list_first)

        # Fetch the second user's friend list
        result = await self.db.execute(select(UserFriendList).where(UserFriendList.user_id == friend_id))
        friend_list_second = result.scalars().first()
        if not friend_list_second:
            raise HTTPException(status_code=404, detail="Friend list not found")
        friend_list_second.friends_list = [friend for friend in friend_list_second.friends_list if friend != user_id]
        await self.db.commit()
        await self.db.refresh(friend_list_second)

        return friend_list_first
    
    async def check_if_already_friend(self, friend_id: UUID, user_id: UUID):
        friends_list = await self.db.execute(select(UserFriendList).where(UserFriendList.user_id == user_id))
        friends_list = friends_list.scalars().first()
        if not friends_list:
            return False
        if friend_id in friends_list.friends_list:
            return True