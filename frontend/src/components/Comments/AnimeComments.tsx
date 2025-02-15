'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getAvatarUrl } from '@/utils/avatar';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Bold, Clock, EyeOff, Smile, Eye } from 'lucide-react';
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
import { MoreHorizontal, ThumbsUp, Reply, Flag, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function AnimeComments({ animeId }: AnimeCommentsProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user, token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formatting, setFormatting] = useState<CommentFormattingState>({
    isBold: false,
    isSpoiler: false,
  });

  console.log('AnimeComments received animeId:', animeId, typeof animeId);

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

  const insertFormatting = (type: 'bold' | 'spoiler' | 'timestamp') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newComment.substring(start, end);

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

    const newText = newComment.substring(0, start) + formattedText + newComment.substring(end);
    setNewComment(newText);
  };

  const onEmojiClick = (emojiObject: any) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = newComment.substring(0, start) + emojiObject.emoji + newComment.substring(start);
    setNewComment(newText);
  };

  return (
    <div className="space-y-8">
      {/* Comment Form */}
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

        <TooltipProvider>
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <CommentAvatar userInfo={user} />
            </div>
            <div className="flex-1 space-y-4">
              <Textarea
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Написать комментарий..."
                className="min-h-[100px] bg-white/[0.02] border-white/5 resize-none focus:ring-[#CCBAE4]/20 placeholder:text-white/40 text-[14px]"
                disabled={isSubmitting}
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
                    onClick={handleSubmitComment}
                    disabled={isSubmitting || !newComment.trim()}
                    className={cn(
                      "h-[45px] px-6 rounded-xl font-medium transition-all duration-200",
                      "bg-[#CCBAE4] hover:bg-[#CCBAE4]/90 text-black",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Отправка...</span>
                      </div>
                    ) : (
                      'Отправить комментарий'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="group relative flex gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <div className="flex flex-col items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="hover:opacity-80 transition-opacity">
                      <CommentAvatar userInfo={comment.userInfo} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ProfileMiniCard userInfo={comment.userInfo} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="font-medium text-white/90 hover:text-white transition-colors">
                        {comment.userInfo?.nickname || comment.userInfo?.username || 'Пользователь'}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <ProfileMiniCard userInfo={comment.userInfo} />
                    </PopoverContent>
                  </Popover>
                  <span className="text-sm text-white/40">
                    {comment.created_at ? new Date(comment.created_at).toLocaleString('ru-RU') : ''}
                  </span>
                </div>
                <CommentText text={comment.text} />
                <div className="flex items-center gap-4 pt-2">
                  <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white/90">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Нравится</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white/90">
                    <Reply className="h-4 w-4" />
                    <span>Ответить</span>
                  </button>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="absolute right-6 top-6 h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    <span>Пожаловаться</span>
                  </DropdownMenuItem>
                  {comment.user_id === user?.id && (
                    <>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Редактировать</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                        <Trash2 className="h-4 w-4" />
                        <span>Удалить</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        ) : (
          <div className="text-center text-white/40 py-8">
            Комментариев пока нет. Будьте первым!
          </div>
        )}
      </div>
    </div>
  );
}
