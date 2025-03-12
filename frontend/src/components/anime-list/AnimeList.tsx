"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { AnimeCard } from "./AnimeCard";
import { AnimeCardSkeleton } from "./AnimeCardSkeleton";
import { Pagination } from "./Pagination";
import { Search, searchQueryAtom } from "./Search";
import { useAtom } from "jotai";
import { Anime, Genre } from "@/shared/types/anime";

const paginationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
};

const genreFetcher = (url: string) => axiosInstance.get<Genre[]>(url).then(res => res.data);

// Функция загрузки аниме
const fetchAllAnime = async (url: string) => {
  try {
    const params = new URLSearchParams(url.split("?")[1] || "");
    params.set("limit", "100000");
    params.set("page", "1");

    ["sort", "order", "page"].forEach(param => params.delete(param));

    const filters = ["status", "kind", "rating"];
    filters.forEach(filter => {
      const value = params.get(filter);
      if (!value || value === "all") {
        params.delete(filter);
      }
    });

    const fullUrl = `/anime/get-anime-list-filtered?${params.toString()}`;
    const response = await axiosInstance.get<{ anime_list: Anime[] }>(fullUrl, { timeout: 30000 });

    return { animeList: response.data.anime_list };
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const AnimeList: React.FC = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery] = useAtom(searchQueryAtom);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  const isDetailPage = pathname.match(/^\/anime\/\d+$/);
  const swrKey = !isDetailPage ? `/anime/get-anime-list-filtered` : null;

  const { data: animeData, error: animeError, isLoading: isAnimeLoading } = useSWR(
    swrKey,
    fetchAllAnime,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  const { data: genres } = useSWR(`/genre/get-list-genres`, genreFetcher);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (
      ["genre_id", "kind", "status", "rating", "start_year", "end_year", "sort", "order"].some(
        param => searchParams.get(param) !== newParams.get(param)
      )
    ) {
      newParams.set("page", "1");
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const selectedGenres = searchParams.getAll("genre_id");
  const selectedKind = searchParams.get("kind") || "all";
  const selectedStatus = searchParams.get("status") || "all";
  const selectedRating = searchParams.get("rating") || "all";
  const startYear = parseInt(searchParams.get("start_year") || "0", 10);
  const endYear = parseInt(searchParams.get("end_year") || "0", 10);
  const sortBy = searchParams.get("sort") || "score";
  const order = searchParams.get("order") || "desc";

  const filteredAndSortedAnime = useMemo(() => {
    if (!animeData?.animeList?.length) return [];

    const searchTerm = searchQuery?.toLowerCase().trim() || "";

    return animeData.animeList
      .filter(anime => {
        if (searchTerm && !(anime.russian?.toLowerCase().includes(searchTerm) || anime.name?.toLowerCase().includes(searchTerm))) {
          return false;
        }

        if (selectedGenres.length && anime.genre_ids) {
          const animeGenres = anime.genre_ids.map(g => g.toString());
          if (!selectedGenres.every(genre => animeGenres.includes(genre))) return false;
        }

        if (selectedKind !== "all" && anime.kind?.toLowerCase() !== selectedKind.toLowerCase()) return false;
        if (selectedStatus !== "all" && anime.status?.toLowerCase() !== selectedStatus.toLowerCase()) return false;
        if (selectedRating !== "all" && anime.rating?.toLowerCase() !== selectedRating.toLowerCase()) return false;

        if (!isNaN(startYear) && !isNaN(endYear) && startYear > 0 && endYear > 0) {
          const animeYear = anime.aired_on ? new Date(anime.aired_on).getFullYear() : null;
          if (!animeYear || animeYear < startYear || animeYear > endYear) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const orderMultiplier = order === "desc" ? -1 : 1;
        switch (sortBy) {
          case "aired_on":
            return (new Date(a.aired_on || 0).getTime() - new Date(b.aired_on || 0).getTime()) * orderMultiplier;
          case "score":
            return ((a.score || 0) - (b.score || 0)) * orderMultiplier;
          case "russian":
            return (a.russian || "").localeCompare(b.russian || "") * orderMultiplier;
          default:
            return 0;
        }
      });
  }, [animeData?.animeList, searchQuery, selectedGenres, selectedKind, selectedStatus, selectedRating, startYear, endYear, sortBy, order]);

  const totalPages = Math.ceil((filteredAndSortedAnime.length || 0) / 30);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router, pathname, searchParams]);

  if (isDetailPage) return null;

  if (isAnimeLoading) {
    return (
      <div className="space-y-8">
        <Search />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array(30).fill(0).map((_, index) => <AnimeCardSkeleton key={index} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Search />
      {!filteredAndSortedAnime.length ? (
        <div className="text-center text-white/80">Ничего не найдено.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredAndSortedAnime.slice((currentPage - 1) * 30, currentPage * 30).map((anime, index) => (
            <AnimeCard key={anime.anime_id || index} genres={genres} anime={anime} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <motion.div
        variants={paginationVariants}
        initial="hidden"
        animate="visible"
        className="sticky w-fit mx-auto bottom-2 z-10 flex items-center justify-center bg-black/90 text-white rounded-2xl px-4 py-2 shadow-lg"
      >
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </motion.div>
      )}
    </div>
  );
});

export default AnimeList;
