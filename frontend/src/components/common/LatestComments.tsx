'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Heart, Clock } from 'lucide-react';
import Link from 'next/link';
import commentService from '@/services/commentService';
import userService from '@/services/userService';
import animeService from '@/services/animeService';
import { Comment } from '@/types/comment';
import { UserAvatar } from '@/components/user/UserAvatar';
import { User } from '@/types/user';

interface CommentWithInfo extends Comment {
  user_info?: {
    username: string;
    nickname?: string;
    user_avatar?: string | null;
  };
  anime_info?: {
    title: string;
  };
}

const LatestComments: React.FC = () => {
  const [commentsWithData, setCommentsWithData] = useState<CommentWithInfo[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['latestComments'],
    queryFn: commentService.getLatestComments,
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  // Получаем данные о пользователях и аниме
  useEffect(() => {
    const fetchAllData = async () => {
      if (comments.length === 0) return;

      setIsLoadingData(true);
      try {
        const commentsWithAllData = await Promise.all(
          comments.map(async (comment) => {
            try {
              if (!comment || !comment.user_id) {
                return comment;
              }

              // Параллельно получаем данные пользователя и аниме
              const [userData, animeData] = await Promise.all([
                userService.getUserById(comment.user_id).catch(() => null),
                // Используем id_of_anime (это числовое ID которое нужно animeService)
                (async () => {
                  try {
                    // id_of_anime содержит числовое ID аниме (например "52991")
                    if (comment.id_of_anime) {
                      return await animeService.getAnimeById(comment.id_of_anime);
                    }
                    return null;
                  } catch {
                    return null;
                  }
                })(),
              ]);

              return {
                ...comment,
                user_info: userData
                  ? {
                      username: userData.username,
                      nickname: userData.nickname,
                      user_avatar: userData.user_avatar,
                    }
                  : undefined,
                anime_info: animeData
                  ? {
                      title: animeData.russian || animeData.english || 'Без названия',
                    }
                  : undefined,
              } as CommentWithInfo;
            } catch {
              return comment;
            }
          })
        );
        setCommentsWithData(commentsWithAllData);
      } catch {
        setCommentsWithData(comments);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchAllData();
  }, [comments]);

  const formatDate = (dateString: string) => {
    try {
      const now = new Date();

      // Если строка даты не содержит информацию о часовом поясе,
      // добавляем 'Z' чтобы интерпретировать как UTC
      let normalizedDateString = dateString;
      if (!dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
        normalizedDateString = dateString + 'Z';
      }

      const commentDate = new Date(normalizedDateString);

      // Проверяем, что дата корректно распарсилась
      if (isNaN(commentDate.getTime())) {
        return 'недавно';
      }

      const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

      // Если разница отрицательная (комментарий из "будущего"), показываем "только что"
      if (diffInSeconds < 0) {
        return 'только что';
      }

      if (diffInSeconds < 60) return 'только что';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;

      return commentDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return 'недавно';
    }
  };

  const getDisplayName = (comment: CommentWithInfo) => {
    if (!comment.user_info) return 'Пользователь';
    return comment.user_info.nickname || comment.user_info.username;
  };

  const getAnimeTitle = (comment: CommentWithInfo) => {
    if (comment.anime_info?.title) {
      return comment.anime_info.title;
    }
    return 'Аниме';
  };

  // Добавляем слушатель события для обновления комментариев
  useEffect(() => {
    const handleCommentCreated = () => {
      queryClient.invalidateQueries({ queryKey: ['latestComments'] });
    };

    // Слушаем кастомное событие создания комментария
    window.addEventListener('commentCreated', handleCommentCreated);

    return () => {
      window.removeEventListener('commentCreated', handleCommentCreated);
    };
  }, [queryClient]);

  if (isLoading || isLoadingData) {
    return (
      <section className='flex flex-col gap-8'>
        <h3 className='text-xl font-semibold text-white/90'>Последние комментарии</h3>
        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className='relative flex flex-col h-full p-4 sm:p-6 rounded-xl border border-white/5'
              >
                <div className='animate-pulse space-y-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 sm:w-11 sm:h-11 bg-white/5 rounded-full'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 bg-white/5 rounded w-24'></div>
                      <div className='h-3 bg-white/5 rounded w-16'></div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='h-4 bg-white/5 rounded w-full'></div>
                    <div className='h-4 bg-white/5 rounded w-3/4'></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    );
  }

  if (commentsWithData.length === 0) {
    return (
      <section className='flex flex-col gap-8'>
        <h3 className='text-xl font-semibold text-white/90'>Последние комментарии</h3>
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4'>
            <MessageCircle size={24} className='text-white/30' />
          </div>
          <p className='text-white/40 mb-2'>Пока нет комментариев</p>
          <p className='text-sm text-white/30'>Будьте первым, кто поделится мнением!</p>
        </div>
      </section>
    );
  }

  return (
    <section className='flex flex-col gap-8'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold text-white/90'>Последние комментарии</h3>
        <Link
          href='/comments/latest'
          className='text-sm text-white/60 hover:text-white/80 transition-colors'
        >
          Все комментарии
        </Link>
      </div>

      <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {commentsWithData
          .filter((comment) => comment && comment.id_of_anime)
          .map((comment) => (
            <div
              key={comment.id}
              className='relative flex flex-col h-full p-4 sm:p-6 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0'>
                  <Link
                    href={`/profile/${comment.user_info?.username || 'unknown'}`}
                    className='flex items-center gap-2.5 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity duration-200'
                  >
                    <UserAvatar
                      user={comment.user_info ? {
                        id: '0',
                        username: comment.user_info.username,
                        nickname: comment.user_info.nickname,
                        avatar_url: comment.user_info.user_avatar,
                        created_at: '',
                        updated_at: '',
                      } as User : null}
                      size="md"
                      className="w-10 h-10 sm:w-11 sm:h-11"
                    />
                    <div className='flex flex-col min-w-0'>
                      <span className='font-medium text-[14px] sm:text-[15px] text-white/90 truncate'>
                        {getDisplayName(comment)}
                      </span>
                    </div>
                  </Link>
                </div>
                <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
                  <div className='flex items-center gap-1.5 text-[11px] text-white/40'>
                    <Heart className='w-3 h-3' />
                    <span className='tabular-nums'>{comment.likes || 0}</span>
                  </div>
                  <div className='flex items-center gap-1.5 text-[11px] text-white/40 bg-white/[0.03] px-2 py-1 rounded-full whitespace-nowrap'>
                    <Clock className='w-3 h-3' />
                    {formatDate(comment.created_at)}
                  </div>
                </div>
              </div>

              <div className='relative mt-6 sm:mt-[30px] pl-3 sm:pl-4'>
                <div className='absolute left-0 top-0 bottom-0 w-[2px] bg-white/5' />
                <Link href={`/anime/${comment.id_of_anime}`} className='block'>
                  <p className='text-[13px] sm:text-[14px] text-white/70 line-clamp-3 leading-relaxed hover:text-white/90 transition-colors'>
                    {comment.text}
                  </p>
                </Link>
              </div>

              <div className='mt-auto pt-6 sm:pt-[30px] flex items-center justify-between gap-3'>
                <Link
                  href={`/anime/${comment.id_of_anime}`}
                  className='flex items-center gap-2 group flex-1 min-w-0'
                >
                  <MessageCircle className='w-4 h-4 text-[#CCBAE4]/70 group-hover:text-[#CCBAE4] transition-colors flex-shrink-0' />
                  <span className='text-[11px] sm:text-xs text-white/50 group-hover:text-white/80 transition-colors truncate'>
                    {getAnimeTitle(comment)}
                  </span>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default LatestComments;