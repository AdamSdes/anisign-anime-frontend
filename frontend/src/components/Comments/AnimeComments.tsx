'use client';

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getAvatarUrl } from '@/utils/avatar';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AnimeCommentsProps {
  animeId: string;  // UUID строка
}

interface Comment {
  id: string;
  text: string;
  user_id: string;
  anime_id: string;
  created_at?: string;
}

interface UserInfo {
  username: string;
  user_avatar: string;
  user_banner: string;
  nickname: string | null;
  id: string;
}

interface CommentWithUser extends Comment {
  userInfo?: UserInfo;
}

// Выносим CommentAvatar за пределы основного компонента
const CommentAvatar = memo(({ userInfo }: { userInfo?: UserInfo }) => {
  const [isLoading, setIsLoading] = useState(true);
  const avatarUrl = userInfo?.user_avatar ? getAvatarUrl(userInfo.user_avatar) : undefined;
  const fallbackText = userInfo?.nickname 
    ? userInfo.nickname.slice(0, 2).toUpperCase() 
    : userInfo?.username?.slice(0, 2).toUpperCase() || 'AN';

  return (
    <Avatar className="relative h-10 w-10 ring-2 ring-white/[0.03] ring-offset-2 ring-offset-[#060606]">
      {isLoading && avatarUrl && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-full" />
      )}
      {avatarUrl && (
        <img 
          src={avatarUrl}
          alt={userInfo?.username || 'User avatar'}
          className={cn(
            "aspect-square h-full w-full rounded-full object-cover",
            isLoading && "invisible"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      )}
      <AvatarFallback className="bg-white/[0.02] text-white/60 text-lg font-medium">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
});

CommentAvatar.displayName = 'CommentAvatar';

export default function AnimeComments({ animeId }: AnimeCommentsProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user, token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('AnimeComments received animeId:', animeId, typeof animeId);

  // Мемоизируем компонент аватара пользователя для формы комментария
  const CommentFormAvatar = useMemo(() => (
    <CommentAvatar userInfo={user} />
  ), [user]);

  // Мемоизируем функцию обработки изменения текста комментария
  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  }, []);

  const fetchUserInfo = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/get-user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();
      console.log('User info received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log('Fetching comments for anime:', animeId);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/comment/get-all-comments-for-anime/${animeId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received comments data:', data);
        
        if (Array.isArray(data)) {
          // Получаем информацию о пользователях для каждого комментария
          const commentsWithUserInfo = await Promise.all(
            data.map(async (comment) => {
              const userInfo = await fetchUserInfo(comment.user_id);
              return { ...comment, userInfo };
            })
          );
          setComments(commentsWithUserInfo);
          console.log('Comments with user info:', commentsWithUserInfo);
        } else {
          console.error('Unexpected data structure:', data);
          setComments([]);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      }
    };

    if (animeId && token) {
      fetchComments();
    }
  }, [animeId, token]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting || !token || !animeId) return;

    try {
      setIsSubmitting(true);
      
      const params = new URLSearchParams({
        anime_id: animeId,
        comment_text: newComment.trim()
      });
      
      console.log('Sending request with params:', params.toString());
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/create-comment-for-anime?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        const errorMessage = responseData.detail 
          ? Array.isArray(responseData.detail)
            ? responseData.detail.map((err: any) => {
                console.log('Error detail:', err);
                return `${err.loc?.join('.')}: ${err.msg}` || err;
              }).join(', ')
            : responseData.detail
          : 'Failed to create comment';
        throw new Error(errorMessage);
      }

      const newCommentData = responseData;
      
      const tempUserInfo = {
        username: user?.username || 'anonymous',
        user_avatar: user?.avatar || '',
        user_banner: '',
        nickname: user?.nickname || null,
        id: user?.id || ''
      };

      const commentWithUser = { 
        ...newCommentData, 
        userInfo: tempUserInfo 
      };
      
      setComments(prevComments => [commentWithUser, ...prevComments]);
      setNewComment('');

      const userInfo = await fetchUserInfo(newCommentData.user_id);
      if (userInfo) {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === newCommentData.id 
              ? { ...comment, userInfo }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Comment Form */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="text-lg font-semibold mb-4">Комментарии</h3>
        <div className="flex gap-4">
          {CommentFormAvatar}
          <div className="flex-1 space-y-4">
            <Textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Написать комментарий..."
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <div className="flex gap-4">
                <CommentAvatar userInfo={comment.userInfo} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white/90">
                      {comment.userInfo?.username || 'Anonymous'}
                    </span>
                    <span className="text-sm text-white/60">
                      {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Только что'}
                    </span>
                  </div>
                  <p className="text-white/80">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-white/60 py-8">
            Пока нет комментариев. Будьте первым!
          </div>
        )}
      </div>
    </div>
  );
}
