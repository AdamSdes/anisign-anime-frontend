import { Anime, Genre } from '@/shared/types/anime';
import { AnimeDescription } from '@/components/ui/anime/AnimeDescription';
import { AnimeHeader } from '@/components/ui/anime/AnimeHeader';
import { AnimePoster } from '@/components/ui/anime/AnimePoster';
import { GenreList } from '@/components/ui/anime/GenreList';
import { InfoBlock } from '@/components/ui/anime/InfoBlock';
import { NextEpisode } from '@/components/ui/anime/NextEpisode';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Comment } from '@/shared/types/comment';
import { animeService } from '@/services/anime';
import { commentsService } from '@/services/comments';


interface AnimeDetailProps {
    className?: string;
  }
  
  export default function AnimeDetail({ className }: AnimeDetailProps) {
    const t = useTranslations('common');
    const params = useParams();
    const searchParams = useSearchParams();
    const [anime, setAnime] = useState<Anime | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const animeId = params.id as string;
  
    useEffect(() => {
      const fetchAnime = async () => {
        try {
            const animeData = await animeService.getAnimeDetails(animeId);
            setAnime(animeData);
          } catch (err: unknown) {
            if (err instanceof Error) {
              setError(err.message || t('errorLoadingAnime'));
            } else {
              setError(t('errorLoadingAnime'));
            }
          } finally {
            setLoading(false);
          }
      };
  
      const fetchComments = async () => {
        try {
            const commentsData = await commentsService.getComments(animeId, { page: 1 });
            setComments(commentsData.comments);
          } catch (err: unknown) {
            if (err instanceof Error) {
              setError(err.message || t('errorLoadingComments'));
            } else {
              setError(t('errorLoadingComments')); 
            }
          }
      };
  
      fetchAnime();
      fetchComments();
    }, [animeId, t]);
  
    if (loading) {
      return (
        <div className={className || 'flex justify-center py-8 text-white/40'}>
          {t('loading')}
        </div>
      );
    }
  
    if (error) {
      return (
        <div className={className || 'flex flex-col items-center justify-center py-16 px-4'}>
          <h3 className="text-lg font-medium text-white/80 mb-2">
            {error}
          </h3>
          <p className="text-sm text-white/40 text-center max-w-md">
            {t('tryAgain')}
          </p>
        </div>
      );
    }
  
    if (!anime) {
      return (
        <div className={className || 'flex flex-col items-center justify-center py-16 px-4'}>
          <h3 className="text-lg font-medium text-white/80 mb-2">
            {t('animeNotFound')}
          </h3>
          <p className="text-sm text-white/40 text-center max-w-md">
            {t('checkAnimeId')}
          </p>
        </div>
      );
    }
  
    return (
      <div className={className || 'space-y-8 p-4 bg-black/90 backdrop-blur-md rounded-xl border border-white/5 shadow-lg'}>
        <AnimePoster anime={anime} className="w-full max-w-md mx-auto mb-6" />
        <div className="space-y-6">
          <AnimeHeader anime={anime} />
          <AnimeDescription anime={anime} />
          <GenreList anime={anime} genres={[]} />
          <InfoBlock anime={anime} />
          <NextEpisode anime={anime} />
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90">
              {t('comments')}
            </h3>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-sm text-white/70">{comment.text}</p>
                  <p className="text-xs text-white/40">
                    {t('by')} {comment.user.username} {comment.rating ? `| ${t('rating')}: ${comment.rating}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }