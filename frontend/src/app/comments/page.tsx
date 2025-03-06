"use client";

import React from "react";
import { atom, useAtom } from "jotai";
import Header from "@/components/header/Header";
import { Report } from "@/components/report/report";
import Footer from "@/components/footer/Footer";
import { MessageCircle, Clock, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CommentsList from "@/components/comments/CommentsList";

// Атом для состояния аутентификации
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

// Атом для состояния комментариев
export const commentsFilterAtom = atom<{
  sortBy: "newest" | "oldest" | "popular";
  filterType: "all" | "my" | "answered";
}>({
  sortBy: "newest",
  filterType: "all",
});

/**
 * Пропсы компонента CommentsPage
 * @interface CommentsPageProps
 */
interface CommentsPageProps {}

/**
 * Компонент страницы комментариев
 * @description Отображает страницу комментариев с фильтрами сортировки и типов
 * @returns {JSX.Element}
 */
const CommentsPage: React.FC<CommentsPageProps> = React.memo(() => {
  const [auth] = useAtom(authAtom);
  const [commentsFilter, setCommentsFilter] = useAtom(commentsFilterAtom);

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Report />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Заголовок */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5">
                <MessageCircle className="w-5 h-5 text-white/60" />
              </div>
              <h1 className="text-xl font-semibold text-white/90">Комментарии</h1>
            </div>

            {/* Фильтры */}
            <div className="flex items-center gap-3">
              <Select
                value={commentsFilter.sortBy}
                onValueChange={(value) =>
                  setCommentsFilter((prev: any) => ({
                    ...prev,
                    sortBy: value as "newest" | "oldest" | "popular",
                  }))
                }
              >
                <SelectTrigger className="h-[50px] pl-4 pr-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-white/40" />
                    <SelectValue placeholder="Сортировка" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#060606]/95 backdrop-blur-xl border-white/5">
                  <SelectGroup className="p-1">
                    <SelectItem
                      value="newest"
                      className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                    >
                      Сначала новые
                    </SelectItem>
                    <SelectItem
                      value="oldest"
                      className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                    >
                      Сначала старые
                    </SelectItem>
                    <SelectItem
                      value="popular"
                      className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                    >
                      По популярности
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={commentsFilter.filterType}
                onValueChange={(value) =>
                  setCommentsFilter((prev: any) => ({
                    ...prev,
                    filterType: value as "all" | "my" | "answered",
                  }))
                }
              >
                <SelectTrigger className="h-[50px] pl-4 pr-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-white/40" />
                    <SelectValue placeholder="Фильтр" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#060606]/95 backdrop-blur-xl border-white/5">
                  <SelectGroup className="p-1">
                    <SelectItem
                      value="all"
                      className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                    >
                      Все комментарии
                    </SelectItem>
                    <SelectItem
                      value="my"
                      className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                      disabled={!auth.isAuthenticated}
                    >
                      Мои комментарии
                    </SelectItem>
                    <SelectItem
                      value="answered"
                      className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                    >
                      С ответами
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Список комментариев */}
          <CommentsList sortBy={commentsFilter.sortBy} filterType={commentsFilter.filterType} animeId={""} />
        </div>
      </div>
      <Footer />
    </main>
  );
});

CommentsPage.displayName = "CommentsPage";
export default CommentsPage;