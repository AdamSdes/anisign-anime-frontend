"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { atom, useAtom } from "jotai";
import { Search } from "lucide-react";
import Header from "@/components/header/Header";
import { Report } from "@/components/report/report";
import Footer from "@/components/footer/Footer";
import { CharacterCard } from "@/components/CharacterCard";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { useRouter, useSearchParams } from "next/navigation";

export const authAtom = atom({
  isAuthenticated: false,
  user: null,
});

interface Character {
  id: string;
  name: string;
  russian: string;
  japanese: string;
  poster_url: string;
  character_id: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const paginationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
};

const CustomPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        endPage = 4;
      }
      
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      if (startPage > 2) {
        pages.push("...");
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded ${currentPage === 1 ? 'text-white/30' : 'text-white hover:bg-white/10'}`}
      >
        &lt;
      </button>
      
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-2 py-1 text-white/50">...</span>
          ) : (
            <button
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-white/20 text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded ${currentPage === totalPages ? 'text-white/30' : 'text-white hover:bg-white/10'}`}
      >
        &gt;
      </button>
    </div>
  );
};

const CharactersPage: React.FC = React.memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nameFilter, setNameFilter] = useState<string>(() => searchParams.get("search") || "");
  const debouncedNameFilter = useDebounce(nameFilter, 300);
  const [auth] = useAtom(authAtom);
  const ITEMS_PER_PAGE = 49;

  const [currentPage, setPageState] = useState<number>(() => 
    parseInt(searchParams.get("page") || "1", 10)
  );

  const updatePageUrl = useCallback((page: number, search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    
    router.replace(`/characters?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handlePageChange = useCallback((page: number) => {
    setPageState(page);
    updatePageUrl(page, nameFilter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updatePageUrl, nameFilter]);

  const handleNameFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newNameFilter = e.target.value;
    setNameFilter(newNameFilter);
    if (currentPage !== 1) {
      setPageState(1);
    }
  }, [currentPage]);

  useEffect(() => {
    updatePageUrl(currentPage, debouncedNameFilter);
  }, [debouncedNameFilter, currentPage, updatePageUrl]);

  const { data: allCharactersData, isLoading: isLoadingAll } = useQuery<Character[]>({
    queryKey: ["characters-all", auth.isAuthenticated],
    queryFn: () =>
      axiosInstance.get(`/character/get-character-list?page=1&limit=100000`).then((res) => res.data),
    enabled: true,
  });

  const filteredCharacters = React.useMemo(() => {
    let characters = allCharactersData || [];
    
    if (debouncedNameFilter) {
      const lowerNameFilter = debouncedNameFilter.toLowerCase();
      characters = characters.filter(character => 
        (character.name && character.name.toLowerCase().includes(lowerNameFilter)) ||
        (character.russian && character.russian.toLowerCase().includes(lowerNameFilter)) ||
        (character.japanese && character.japanese.toLowerCase().includes(lowerNameFilter))
      );
    }
    
    return characters;
  }, [allCharactersData, debouncedNameFilter]);

  const totalPages = Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE);
  const paginatedCharacters = filteredCharacters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Report />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6 mb-8">
          <h1 className="text-3xl font-bold text-white/90">Персонажи</h1>
          
          <div className="w-full">
            <div className="relative">
              <Search className="absolute inset-y-0 left-4 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={nameFilter}
                onChange={handleNameFilterChange}
                className="w-full h-12 pl-12 pr-4 bg-white/[0.02] border border-white/5 rounded-xl text-white/80 placeholder:text-white/40 focus:ring-2 focus:ring-white/10 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {isLoadingAll && !debouncedNameFilter && (
          <div className="text-center py-8 text-white/60">Загрузка...</div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${debouncedNameFilter}-page-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6"
          >
            {paginatedCharacters.length > 0 ? (
              paginatedCharacters.map((character) => (
                <motion.div key={character.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <CharacterCard {...character} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-white/60">
                Персонажей не найдено. Попробуйте изменить запрос или обновить данные.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <motion.div
            variants={paginationVariants}
            initial="hidden"
            animate="visible"
            className="sticky w-fit mx-auto bottom-2 z-10 flex items-center justify-center bg-black/90 text-white rounded-2xl px-4 py-2 shadow-lg"
          >
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
});

CharactersPage.displayName = "CharactersPage";
export default CharactersPage;