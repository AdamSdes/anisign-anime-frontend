"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import AnimeDetails from "@/components/anime-detail/AnimeDetails";
import RelatedAnime from "@/components/anime-detail/RelatedAnime";
import Header from "@/components/header/Header";
import { Report } from "@/components/report/report";
import Footer from "@/components/footer/Footer";
import { VideoPlayer } from "@/components/anime/video-player";
import { atom, useAtom } from "jotai";
import useSWR, { mutate } from "swr";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import AnimeComments from "@/components/comments/AnimeComments";
import { Anime as SharedAnime } from "@/shared/types/anime";
import { Genre as SharedGenre } from "@/shared/types/anime";

// Атом для состояния аутентификации
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { id: string; username: string; token?: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

// Динамический импорт Screenshots
const Screenshots = dynamic(
  () => import("@/components/anime/screenshots").then(mod => ({ default: mod.Screenshots })),
  {
    loading: () => <div className="text-white/40 text-center">Loading screenshots...</div>,
    ssr: false,
  }
);

/**
 * Интерфейс данных из бэкенда
 * @interface Anime
 */
interface Anime {
  id: string;
  anime_id: string;
  russian: string;
  name: string;
  poster_url: string;
  aired_on: string;
  kind: string;
  duration: number;
  season: string;
  english: string;
  status: string;
  episodes_aired: number;
  released_on: string;
  franchise: string;
  genre_ids: number[];
  screenshots?: string[];
  related_anime_ids?: string[];
  related_anime_texts?: string[];
  episodes?: number;
  score?: number;
  description?: string;
  rating?: string;
  studios?: string[];
  date_of_broadcast?: string;
}

/**
 * Интерфейс данных жанра
 * @interface Genre
 */
interface Genre {
  id: string;
  name: string;
  genre_id: number;
  russian: string;
}

/**
 * Интерфейс связанного аниме для RelatedAnime компонента
 * @interface RelatedAnimeExtended
 */
interface RelatedAnimeExtended {
  anime_id: string;
  name: string;
  russian: string;
  poster_url: string;
  relation_type: string;
  kind: string;
  aired_on: string;
  episodes?: number;
  score?: number;
}

/**
 * Пропсы компонента Page (Anime)
 * @interface PageAnimeProps
 */
interface PageAnimeProps {}

/**
 * Компонент страницы аниме
 * @description Отображает детальную информацию об аниме, включая скриншоты, плеер, связанные аниме и комментарии
 * @returns {JSX.Element}
 */
const PageAnime: React.FC<PageAnimeProps> = React.memo(() => {
  const { id } = useParams();
  const [auth] = useAtom(authAtom);
  const animeId = typeof id === "string" ? id.split("-")[0] : Array.isArray(id) ? id[0]?.split("-")[0] : undefined;

  // Логирование для диагностики
  console.log("ID from useParams:", id);
  console.log("Extracted animeId:", animeId);

  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedAnime, setRelatedAnime] = useState<RelatedAnimeExtended[]>([]);

  // SWR для данных аниме
  const { data: animeData, error: animeError, isLoading: animeLoading } = useSWR<Anime>(
    animeId ? `/anime/id/${animeId}` : null,
    async (url) => {
      console.log("Fetching anime from:", url);
      try {
        const res = await axiosInstance.get(url);
        const data = res.data;
        console.log("Fetched anime data:", data);
        return {
          id: data.id || data.anime_id || "",
          anime_id: data.anime_id || "",
          russian: data.russian || "",
          name: data.name || "",
          poster_url: data.poster_url || "",
          aired_on: data.aired_on || "",
          kind: data.kind || "",
          duration: data.duration || 0,
          season: data.season || "",
          english: data.english || "",
          status: data.status || "",
          episodes_aired: data.episodes_aired || 0,
          released_on: data.released_on || "",
          franchise: data.franchise || "",
          genre_ids: data.genre_ids || [],
          screenshots: data.screenshots || [],
          related_anime_ids: data.related_anime_ids || [],
          related_anime_texts: data.related_anime_texts || [],
          episodes: data.episodes || 0,
          score: data.score || 0,
          description: data.description || "",
          rating: data.rating || "",
          studios: data.studios || [],
          date_of_broadcast: data.date_of_broadcast || data.aired_on || "",
        };
      } catch (error) {
        throw error;
      }
    },
    { revalidateOnFocus: false }
  );

  // SWR для жанров
  const { data: genres, error: genresError, isLoading: genresLoading } = useSWR<Genre[]>(
    "/genre/get-list-genres",
    async (url) => {
      console.log("Fetching genres from:", url);
      try {
        const res = await axiosInstance.get(url);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    { revalidateOnFocus: false }
  );

  // Обновление заголовка страницы
  useEffect(() => {
    if (animeData?.russian || animeData?.name) {
      document.title = animeData.russian || animeData.name;
    }
  }, [animeData]);

  // Обработка истории просмотров
  useEffect(() => {
    if (auth.isAuthenticated && auth.user && auth.user.id && animeData?.id && auth.user.token) {
      const updateViewHistory = async () => {
        try {
          await axiosInstance.post(
            `/viewhistory/add-anime-to-view-history-of-user/${auth.user!.id}?anime_id=${animeData.id}`,
            null,
            {
              headers: { Authorization: `Bearer ${auth.user!.token}` },
            }
          );
          mutate(`/viewhistory/get-view-history-of-user/${auth.user!.id}`);
        } catch (error: any) {
          console.error("Error updating view history:", error.message);
          if (error.response) {
            console.error("Error response:", {
              data: error.response.data,
              status: error.response.status,
            });
          }
        }
      };
      updateViewHistory();
    }
  }, [auth, animeData]);

  // Загрузка связанных аниме
  useEffect(() => {
    const fetchRelatedAnime = async () => {
      if (!animeData?.related_anime_ids || animeData.related_anime_ids.length === 0) {
        return;
      }
      
      setLoadingRelated(true);
      
      try {
        const relatedPromises = animeData.related_anime_ids.map(async (id: string, index: number) => {
          try {
            const response = await axiosInstance.get(`/anime/id/${id}`);
            const relatedAnimeData = response.data;
            
            if (!relatedAnimeData || !relatedAnimeData.anime_id || !relatedAnimeData.name || !relatedAnimeData.poster_url) {
              return null;
            }
            
            return {
              anime_id: relatedAnimeData.anime_id,
              name: relatedAnimeData.name,
              russian: relatedAnimeData.russian || relatedAnimeData.name,
              poster_url: relatedAnimeData.poster_url,
              relation_type: animeData.related_anime_texts?.[index] || "Связанное аниме",
              kind: relatedAnimeData.kind || "Unknown",
              aired_on: relatedAnimeData.aired_on || "",
              episodes: relatedAnimeData.episodes,
              score: relatedAnimeData.score,
            };
          } catch (error) {
            console.error(`Error fetching related anime with ID ${id}:`, error);
            return null;
          }
        });

        const relatedResults = await Promise.all(relatedPromises);
        const validResults = relatedResults.filter(
          (anime): anime is NonNullable<typeof anime> =>
            anime !== null && typeof anime === "object" && !!anime.anime_id
        );
        
        if (validResults.length > 0) {
          setRelatedAnime(validResults);
        }
      } catch (error) {
        console.error("Error fetching related anime:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedAnime();
  }, [animeData]);

  if (animeLoading || genresLoading) {
    return (
      <>
        <Header />
        <Report />
        <main className="container mx-auto max-w-[1400px] px-4 py-10">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (animeError || genresError || !animeData) {
    console.log("Anime error or data not found:", { animeError, genresError, animeData });
    return (
      <>
        <Header />
        <Report />
        <main className="container mx-auto max-w-[1400px] px-4 py-10">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-2 text-white/80">Аниме не найдено</h2>
            <p className="text-white/40">Возможно, оно было удалено или перемещено</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const mapToAnimeDetailsFormat = (apiData: Anime): SharedAnime => {
    const validStatuses = ["ongoing", "released", "announced"] as const;
    type ValidStatus = typeof validStatuses[number];
    const status: ValidStatus = validStatuses.includes(apiData.status as ValidStatus)
      ? (apiData.status as ValidStatus)
      : "released"; 

    return {
      anime_id: parseInt(apiData.anime_id),
      russian: apiData.russian,
      name: apiData.name || apiData.english,
      poster_url: apiData.poster_url || "",
      aired_on: apiData.aired_on || "",
      kind: apiData.kind,
      duration: apiData.duration,
      season: apiData.season,
      english: apiData.english,
      episodes_aired: apiData.episodes_aired,
      released_on: apiData.released_on || "",
      franchise: apiData.franchise,
      genre_ids: apiData.genre_ids.map(id => id.toString()),
      episodes: apiData.episodes || 0,
      score: apiData.score || 0,
      description: apiData.description || "",
      rating: apiData.rating || "",
      date_of_broadcast: apiData.date_of_broadcast || apiData.aired_on || "",
      id: apiData.id || apiData.anime_id || "",
      status,
    };
  };

  return (
    <>
      <Header />
      <Report />
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-16">
          <AnimeDetails
            animeId={parseInt(animeData.anime_id)}
            anime={mapToAnimeDetailsFormat(animeData) as SharedAnime}
            genres={genres?.map(genre => ({
              id: genre.id,
              name: genre.name,
              genre_id: genre.genre_id.toString(),
              russian: genre.russian,
            } as SharedGenre)) || []}
          />
          {animeData && (
            <div className="space-y-8">
              <Suspense fallback={<div className="text-white/40 text-center">Loading screenshots...</div>}>
                {animeData.screenshots && animeData.screenshots.length > 0 && (
                  <Screenshots screenshots={animeData.screenshots} />
                )}
              </Suspense>
              <VideoPlayer
                shikimoriId={animeData.anime_id}
                animeId={animeData.anime_id}
                totalEpisodes={animeData.episodes || 12}
                animeName={animeData.russian || animeData.name} 
              />
              {relatedAnime.length > 0 && (
                <RelatedAnime relatedAnimeList={relatedAnime} animeId={0} />
              )}
            </div>
          )}
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <div className="mt-8">
          <AnimeComments animeId={animeData.anime_id} />
        </div>
      </div>
      <Footer />
    </>
  );
});

export default PageAnime;