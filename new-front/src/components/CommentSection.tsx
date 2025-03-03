'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react'
import { useParams } from 'next/navigation';
import { Comment, CommentResponse } from '@/shared/types/comment';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import Image from 'next/image';
import { useAuthState } from '@/lib/stores/authStore';
import useSWR, { mutate } from 'swr';
import { commentsService } from '@/services/comments';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { Label } from './ui/label/Label';

interface CommentSectionProps {
  animeId: string;
  className?: string;
}

export function CommentSection({ animeId, className }: CommentSectionProps) {
  const t = useTranslations('common');
  const params = useParams();
  const { user, isAuthenticated } = useAuthState();
  const [newComment, setNewComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; 

  // Использование SWR для кэширования комментариев
  const { data: commentsData, error: commentsError, isLoading } = useSWR<CommentResponse, Error>(
    `/anime/${animeId}/comments?page=${currentPage}&limit=${limit}`,
    () => commentsService.getComments(animeId, { page: currentPage, limit }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Безопасная обработка данных комментариев с useMemo
  const comments = useMemo(() => commentsData?.commments || [], [commentsData]);
  const totalPages = useMemo(() => Math.ceil(commentsData?.total_count || 0) / limit, [commentsData]); 

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      setError(t('loginRequired'));
      return;
    }
    if (!newComment.trim()) {
      setError(t('commentRequired'));
      return;
    }

    try {
      await commentsService.postComment(animeId, newComment);
      setNewComment(''); 
      setError(null);
      // Обновляем кэш SWR для комментариев
      mutate(`/anime/${animeId}/comments?page=${currentPage}&limit=${limit}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t('errorPostingComment'));
      } else {
        setError(t('errorPostingComment'));
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className={className || 'flex justify-center py-8 text-white/40'}>
        {t('loading')}
      </div>
    );
  }

  if (commentsError) {
    return (
      <div className={className || 'flex flex-col items-center justify-center py-16 px-4'}>
        <h3 className="text-lg font-medium text-white/80 mb-2">
          {commentsError.message || t('errorLoadingComments')}
        </h3>
        <p className="text-sm text-white/40 text-center max-w-md">
          {t('tryAgain')}
        </p>
      </div>
    );
  }

  return (
    <div className={className || 'space-y-8 p-4 bg-black/90 backdrop-blur-md rounded-xl border border-white/5 shadow-lg'}>
      <h3 className="text-lg font-medium text-white/90">
        {t('comments')}
      </h3>
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newComment" className="text-white/80">
              {t('addComment')}
            </Label>
            <Input
              id="newComment"
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('commentPlaceholder')}
              className="bg-white/[0.02] border border-white/5 rounded-xl text-white/60 placeholder:text-white/40 focus:ring-2 focus:ring-[#CCBAE4]/50"
            />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-sm">
              <span>{error}</span>
            </div>
          )}
          <Button
            type="submit"
            variant="default"
            className="bg-gray-200 text-black hover:bg-gray-300 rounded-xl"
          >
            {t('submitComment')}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-white/60">
          {t('loginToComment')}
        </p>
      )}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-white/60">
            {t('noComments')}
          </p>
        ) : (
            comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-sm text-white/70">{comment.text}</p>
                  <p className="text-xs text-white/40">
                    {t('by')} {comment.user.username} {comment.rating ? `| ${t('rating')}: ${comment.rating}` : ''}
                  </p>
                </div>
            ))
        )}
      </div>
      {totalPages && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}