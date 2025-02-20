'use client';

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getAvatarUrl } from '@/utils/avatar';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Bold, Clock, EyeOff, Smile, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import EmojiPicker from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { MoreHorizontal, Reply, Flag, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

interface AnimeCommentsProps {
  animeId: string;  // UUID строка
}

interface Comment {
  id: string;
  text: string;
  user_id: string;
  anime_id: string;
  created_at?: string;
  likes?: number;
  user_liked_list: string[];
  reply_to_comment_id?: string;
  comment_type: 'comment' | 'reply';
  is_edited?: boolean;
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

interface CommentFormattingState {
  isBold: boolean;
  isSpoiler: boolean;
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

// Компонент мини-карточки профиля
const ProfileMiniCard = memo(({ userInfo }: { userInfo?: UserInfo }) => {
  if (!userInfo) return null;

  const avatarUrl = userInfo.user_avatar ? getAvatarUrl(userInfo.user_avatar) : undefined;
  const fallbackText = userInfo.nickname 
    ? userInfo.nickname.slice(0, 2).toUpperCase() 
    : userInfo.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center w-[185px] p-4 gap-3 rounded-[14px] overflow-hidden bg-[#060606]/95 backdrop-blur-xl border border-white/5">
      <div className="relative w-full">
        <div className="absolute inset-0 z-0">
          {avatarUrl && (
            <>
              <img 
                src={avatarUrl}
                alt="" 
                className="w-full h-full object-cover scale-105 blur-[2px]"
              />
              <div className="absolute inset-0 bg-black/70 rounded-[12px] border border-white/5 backdrop-blur-[2px]" />
            </>
          )}
          <div className="absolute inset-0 bg-[#060606]/80" />
        </div>

        <div className="relative z-10 flex flex-col items-center py-3">
          <Avatar className="h-[90px] w-[90px] ring-2 ring-white/[0.03] ring-offset-2 ring-offset-[#060606]">
            <AvatarImage 
              src={avatarUrl}
              className="object-cover"
            />
            <AvatarFallback className="bg-white/[0.02] text-white/60 text-2xl font-medium">
              {fallbackText}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center mt-3 gap-1">
            <span className="font-medium text-white/90">
              {userInfo.nickname || userInfo.username}
            </span>
            {userInfo.nickname && (
              <span className="text-sm text-white/40">@{userInfo.username}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileMiniCard.displayName = 'ProfileMiniCard';

// Компонент для отображения форматированного текста комментария
const CommentText = memo(({ text }: { text: string }) => {
  const [showSpoiler, setShowSpoiler] = useState<{ [key: number]: boolean }>({});

  const renderFormattedText = (text: string) => {
    // Разбиваем текст на части, сохраняя форматирование
    const parts = text.split(/(\*\*.*?\*\*|\|\|.*?\|\||\[.*?\])/g);

    return parts.map((part, index) => {
      // Жирный текст
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-bold">{boldText}</strong>;
      }
      
      // Спойлер
      if (part.startsWith('||') && part.endsWith('||')) {
        const spoilerText = part.slice(2, -2);
        const isRevealed = showSpoiler[index] || false;

        return (
          <button
            key={index}
            onClick={() => setShowSpoiler(prev => ({ ...prev, [index]: !prev[index] }))}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-all",
              isRevealed
                ? "bg-white/5 hover:bg-white/10"
                : "bg-white/10 hover:bg-white/20"
            )}
          >
            {isRevealed ? (
              <Eye className="w-3 h-3 text-white/60" />
            ) : (
              <EyeOff className="w-3 h-3 text-white/60" />
            )}
            <span className={cn(
              "transition-colors",
              isRevealed ? "text-white/90" : "text-transparent select-none"
            )}>
              {spoilerText}
            </span>
          </button>
        );
      }
      
      // Таймкод
      if (part.startsWith('[') && part.endsWith(']')) {
        const timestamp = part.slice(1, -1);
        return (
          <button
            key={index}
            onClick={() => {
              // Здесь можно добавить логику перехода к временной метке видео
              console.log('Переход к таймкоду:', timestamp);
            }}
            className="inline-flex items-center gap-1 px-1 text-[#CCBAE4] hover:underline"
          >
            <Clock className="w-3 h-3" />
            {timestamp}
          </button>
        );
      }

      // Обычный текст
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="whitespace-pre-wrap break-words">
      {renderFormattedText(text)}
    </div>
  );
});

CommentText.displayName = 'CommentText';

// Добавляем новый компонент CommentForm
const CommentForm = memo(({ 
  onSubmit, 
  replyTo = null, 
  onCancelReply = null,
  disabled = false,
  initialText = ''
}: { 
  onSubmit: (text: string) => void, 
  replyTo?: Comment | null,
  onCancelReply?: (() => void) | null,
  disabled?: boolean,
  initialText?: string
}) => {
  const [commentText, setCommentText] = useState(initialText);
  const [formatting, setFormatting] = useState<CommentFormattingState>({
    isBold: false,
    isSpoiler: false,
  });
  const { user } = useAuthStore();

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onSubmit(commentText);
    setCommentText('');
  };

  const insertFormatting = (type: 'bold' | 'spoiler' | 'timestamp') => {
    const textarea = document.querySelector(`textarea[data-reply-to="${replyTo?.id || 'main'}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = commentText.substring(start, end);

    let formattedText = '';
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'spoiler':
        formattedText = `||${selectedText}||`;
        break;
      case 'timestamp':
        formattedText = `[${selectedText || '00:00'}]`;
        break;
    }

    const newText = commentText.substring(0, start) + formattedText + commentText.substring(end);
    setCommentText(newText);
  };

  const onEmojiClick = (emojiObject: any) => {
    const textarea = document.querySelector(`textarea[data-reply-to="${replyTo?.id || 'main'}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = commentText.substring(0, start) + emojiObject.emoji + commentText.substring(start);
    setCommentText(newText);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-2">
        <CommentAvatar userInfo={user} />
      </div>
      <div className="flex-1 space-y-4">
        {replyTo && (
          <div className="flex items-center gap-2 text-sm text-white/60 bg-white/[0.02] p-2 rounded-lg">
            <span>Ответ на комментарий от {replyTo.userInfo?.nickname || replyTo.userInfo?.username}</span>
            {onCancelReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelReply}
                className="h-6 px-2 text-xs"
              >
                Отменить
              </Button>
            )}
          </div>
        )}
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={replyTo ? "Написать ответ..." : "Написать комментарий..."}
          className="min-h-[100px] bg-white/[0.02] border-white/5 resize-none focus:ring-[#CCBAE4]/20 placeholder:text-white/40 text-[14px]"
          disabled={disabled}
          data-reply-to={replyTo?.id || 'main'}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8", formatting.isBold && "bg-white/10")}
                  onClick={() => insertFormatting('bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Жирный текст</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8", formatting.isSpoiler && "bg-white/10")}
                  onClick={() => insertFormatting('spoiler')}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Спойлер</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => insertFormatting('timestamp')}
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Таймкод</p>
              </TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width="100%"
                  height={400}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="ml-auto">
            <Button
              onClick={handleSubmit}
              disabled={disabled || !commentText.trim()}
              className={cn(
                "h-[45px] px-6 rounded-xl font-medium transition-all duration-200",
                "bg-[#CCBAE4] hover:bg-[#CCBAE4]/90 text-black",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {disabled ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Отправка...</span>
                </div>
              ) : (
                replyTo ? 'Отправить ответ' : 'Отправить комментарий'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

CommentForm.displayName = 'CommentForm';

export default function AnimeComments({ animeId }: AnimeCommentsProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [showReplyFormFor, setShowReplyFormFor] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, token, isAuthenticated } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [formatting, setFormatting] = useState<CommentFormattingState>({
    isBold: false,
    isSpoiler: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({});
  const [optimisticLikes, setOptimisticLikes] = useState<{ [key: string]: boolean }>({});
  const [optimisticLikeCounts, setOptimisticLikeCounts] = useState<{ [key: string]: number }>({});
  const [likeInProgress, setLikeInProgress] = useState<{ [key: string]: boolean }>({});
  const [deleteInProgress, setDeleteInProgress] = useState<{ [key: string]: boolean }>({});

  console.log('AnimeComments received animeId:', animeId, typeof animeId);

  useEffect(() => {
    if (comments) {
      const initialLikedState = comments.reduce((acc, comment) => ({
        ...acc,
        [comment.id]: comment.user_liked_list?.includes(user?.id || '')
      }), {});
      setLikedComments(initialLikedState);
    }
  }, [comments, user]);

  const fetchUserInfo = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/get-user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/get-all-comments-for-anime/${animeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      
      // Получаем информацию о пользователях для каждого комментария
      const commentsWithUserInfo = await Promise.all(
        data.map(async (comment: Comment) => {
          const userInfo = await fetchUserInfo(comment.user_id);
          return { ...comment, userInfo };
        })
      );

      setComments(commentsWithUserInfo);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [animeId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (text: string, parentComment: Comment | null = null) => {
    if (isSubmitting || !token || !animeId) return;

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({
        anime_id: animeId,
        comment_text: text.trim()
      });

      const commentType = parentComment ? 'reply' : 'comment';
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/comment/create-comment-for-anime/${commentType}`;
      
      if (parentComment) {
        params.append('reply_to_comment_id', parentComment.id);
      }

      const response = await fetch(
        `${endpoint}?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create comment: ${response.status} ${errorText}`);
      }

      setShowReplyFormFor(null);
      await fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSingleComment = (commentId: string, updates: Partial<Comment>) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId
          ? { ...comment, ...updates }
          : comment
      )
    );
  };

  const handleLike = async (comment: Comment) => {
    if (!token || !user?.id) {
      return;
    }

    if (likeInProgress[comment.id]) return;

    const isCurrentlyLiked = comment.user_liked_list?.includes(user.id);
    const currentLikes = comment.likes ?? 0;
    
    setLikeInProgress(prev => ({ ...prev, [comment.id]: true }));
    
    // Оптимистично обновляем UI
    const newLikeCount = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;
    const newLikedList = isCurrentlyLiked 
      ? comment.user_liked_list.filter(id => id !== user.id)
      : [...(comment.user_liked_list || []), user.id];

    // Обновляем комментарий локально
    updateSingleComment(comment.id, {
      likes: newLikeCount,
      user_liked_list: newLikedList
    });

    try {
      const endpoint = isCurrentlyLiked ? 'dislike-comment' : 'like-comment';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/${endpoint}/${comment.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // Возвращаем предыдущее состояние в случае ошибки
        updateSingleComment(comment.id, {
          likes: currentLikes,
          user_liked_list: comment.user_liked_list
        });
        throw new Error('Failed to update like status');
      }

      // Обновляем состояние после успешного запроса
      const updatedComment = await response.json();
      if (updatedComment.detail) {
        throw new Error(updatedComment.detail);
      }

      // Обновляем состояние комментария
      await fetchComments();

    } catch (error) {
      console.error('Error updating like:', error);
      setError(error instanceof Error ? error.message : 'Failed to update like status');
    } finally {
      setLikeInProgress(prev => ({ ...prev, [comment.id]: false }));
    }
  };

  const handleDislike = async (commentId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/dislike-comment/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to dislike comment');
      }
      await fetchComments();
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    // Найдем textarea и сфокусируемся на нем
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  const groupedComments = useMemo(() => {
    const grouped: { [key: string]: CommentWithUser[] } = {};
    const topLevelComments: CommentWithUser[] = [];

    comments.forEach(comment => {
      if (comment.reply_to_comment_id) {
        if (!grouped[comment.reply_to_comment_id]) {
          grouped[comment.reply_to_comment_id] = [];
        }
        grouped[comment.reply_to_comment_id].push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });

    return { topLevelComments, replies: grouped };
  }, [comments]);

  const handleDeleteComment = async (commentId: string) => {
    if (!token || deleteInProgress[commentId]) return;
    
    setDeleteInProgress(prev => ({ ...prev, [commentId]: true }));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/delete-comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete comment');
      }

      // Optimistically remove the comment and its replies
      setComments(prevComments => prevComments.filter(comment => 
        comment.id !== commentId && comment.reply_to_comment_id !== commentId
      ));

      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to delete comment. Please try again.');
      }
      console.error('Error deleting comment:', error);
    } finally {
      setDeleteInProgress(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleEditComment = async (commentId: string, newText: string) => {
    if (!token || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/update-comment/${commentId}?text=${encodeURIComponent(newText)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData && errorData.detail) {
          throw new Error(errorData.detail);
        }
        throw new Error('Failed to edit comment');
      }

      // Update the comment in state
      setComments(prevComments => prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, text: newText, is_edited: true }
          : comment
      ));

      setEditingComment(null);
      setError(null);
    } catch (error) {
      console.error('Error editing comment:', error);
      setError(error instanceof Error ? error.message : 'Failed to edit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {/* Main Comment Form */}
        {isAuthenticated && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-white/60" />
                <h3 className="text-[18px] font-semibold text-white/90">
                  Комментарии 
                  <span className="text-[14px] text-white/40 ml-2">
                    {comments.length}
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[13px] text-white/40 hover:text-white/90"
                >
                  Новые
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[13px] text-white/40 hover:text-white/90"
                >
                  Старые
                </Button>
              </div>
            </div>
            <CommentForm
              onSubmit={handleSubmitComment}
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-6"
                >
                  <div className="flex gap-4 items-start">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : groupedComments.topLevelComments.length > 0 ? (
            groupedComments.topLevelComments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                <div className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-6">
                  <div className="flex gap-4 items-start">
                    <Popover>
                      <PopoverTrigger>
                        <CommentAvatar userInfo={comment.userInfo} />
                      </PopoverTrigger>
                      <PopoverContent className="w-80 border-white/[0.03] bg-[#060606] p-4">
                        <ProfileMiniCard userInfo={comment.userInfo} />
                      </PopoverContent>
                    </Popover>

                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="font-medium text-white/90">
                          {comment.userInfo?.nickname || comment.userInfo?.username}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-white/40">
                          <Clock className="h-4 w-4" />
                          {comment.created_at ? new Date(comment.created_at).toLocaleString('ru-RU') : ''}
                          {comment.is_edited && (
                            <span className="ml-2 text-white/30">(изменено)</span>
                          )}
                        </span>
                      </div>

                      {editingComment?.id === comment.id ? (
                        <CommentForm
                          onSubmit={(text) => handleEditComment(comment.id, text)}
                          disabled={isSubmitting}
                          initialText={comment.text}
                          onCancelEdit={() => setEditingComment(null)}
                        />
                      ) : (
                        <div className="text-white/80">
                          <CommentText text={comment.text} />
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button 
                              className={cn(
                                "flex items-center gap-2 text-white/40 hover:text-white/90 transition-colors",
                                {
                                  "cursor-not-allowed opacity-50": likeInProgress[comment.id]
                                }
                              )}
                              onClick={() => handleLike(comment)}
                              disabled={!token || likeInProgress[comment.id]}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.div
                                animate={{
                                  scale: likedComments[comment.id] ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <ThumbsUp 
                                  className={cn("h-4 w-4", {
                                    "text-blue-500 fill-blue-500": likedComments[comment.id]
                                  })} 
                                />
                              </motion.div>
                              <AnimatePresence mode="wait">
                                <motion.span 
                                  key={comment.likes ?? 0}
                                  initial={{ y: -10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: 10, opacity: 0 }}
                                  className="text-[13px]"
                                >
                                  {comment.likes ?? 0}
                                </motion.span>
                              </AnimatePresence>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {!token ? "Войдите, чтобы поставить лайк" : "Нравится"}
                          </TooltipContent>
                        </Tooltip>

                        {isAuthenticated && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowReplyFormFor(comment.id);
                                  setReplyingTo(comment);
                                }}
                                className="flex items-center gap-2 text-white/40 hover:text-white/90"
                              >
                                <Reply className="h-4 w-4" />
                                <span className="text-[13px]">
                                  {groupedComments.replies[comment.id]?.length || 0} Ответов
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Ответить
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>

                  {isAuthenticated && comment.user_id === user?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-6 top-6 h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingComment(comment)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Редактировать</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(comment.id)}
                          className="flex items-center gap-2 text-red-500"
                        >
                          {deleteInProgress[comment.id] ? (
                            <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span>Удалить</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Reply Form */}
                {isAuthenticated && showReplyFormFor === comment.id && (
                  <div className="ml-8 pl-6">
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                      <CommentForm 
                        onSubmit={(text) => handleSubmitComment(text, comment)}
                        replyTo={comment}
                        onCancelReply={() => setShowReplyFormFor(null)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

                {/* Replies */}
                {groupedComments.replies[comment.id]?.length > 0 && (
                  <div className="ml-8 space-y-4 border-l-2 border-white/5 pl-6">
                    {groupedComments.replies[comment.id].map((reply) => (
                      <div
                        key={reply.id}
                        className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-6"
                      >
                        <div className="flex gap-4 items-start">
                          <Popover>
                            <PopoverTrigger>
                              <CommentAvatar userInfo={reply.userInfo} />
                            </PopoverTrigger>
                            <PopoverContent className="w-80 border-white/[0.03] bg-[#060606] p-4">
                              <ProfileMiniCard userInfo={reply.userInfo} />
                            </PopoverContent>
                          </Popover>

                          <div className="flex-1">
                            <div className="mb-4 flex items-center gap-3">
                              <span className="font-medium text-white/90">
                                {reply.userInfo?.nickname || reply.userInfo?.username}
                              </span>
                              <span className="flex items-center gap-1 text-sm text-white/40">
                                <Clock className="h-4 w-4" />
                                {reply.created_at ? new Date(reply.created_at).toLocaleString('ru-RU') : ''}
                                {reply.is_edited && (
                                  <span className="ml-2 text-white/30">(изменено)</span>
                                )}
                              </span>
                            </div>

                            {editingComment?.id === reply.id ? (
                              <CommentForm
                                onSubmit={(text) => handleEditComment(reply.id, text)}
                                disabled={isSubmitting}
                                initialText={reply.text}
                                onCancelEdit={() => setEditingComment(null)}
                              />
                            ) : (
                              <div className="text-white/80">
                                <CommentText text={reply.text} />
                              </div>
                            )}

                            <div className="mt-4 flex items-center gap-4">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.button 
                                    className={cn(
                                      "flex items-center gap-2 text-white/40 hover:text-white/90 transition-colors",
                                      {
                                        "cursor-not-allowed opacity-50": likeInProgress[reply.id]
                                      }
                                    )}
                                    onClick={() => handleLike(reply)}
                                    disabled={!token || likeInProgress[reply.id]}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <motion.div
                                      animate={{
                                        scale: likedComments[reply.id] ? [1, 1.2, 1] : 1,
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ThumbsUp 
                                        className={cn("h-4 w-4", {
                                          "text-blue-500 fill-blue-500": likedComments[reply.id]
                                        })} 
                                      />
                                    </motion.div>
                                    <AnimatePresence mode="wait">
                                      <motion.span 
                                        key={reply.likes ?? 0}
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        className="text-[13px]"
                                      >
                                        {reply.likes ?? 0}
                                      </motion.span>
                                    </AnimatePresence>
                                  </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {!token ? "Войдите, чтобы поставить лайк" : "Нравится"}
                                </TooltipContent>
                              </Tooltip>

                              {isAuthenticated && reply.user_id === user?.id && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-6 top-6 h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => setEditingComment(reply)}
                                      className="flex items-center gap-2"
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span>Редактировать</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteComment(reply.id)}
                                      className="flex items-center gap-2 text-red-500"
                                    >
                                      {deleteInProgress[reply.id] ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                      <span>Удалить</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center text-white/40">
              Пока нет комментариев. Будьте первым!
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
