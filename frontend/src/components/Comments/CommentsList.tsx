"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { RecentComment } from "./RecentComment";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { Comment, Author } from "@/shared/types/comment";

// Интерфейс пропсов компонента CommentsList
interface CommentsListProps {
  sortBy: string; 
  filterType: string; 
  animeId: string; 
}

// Функция загрузки комментариев через SWR
const fetcher = (url: string) =>
  axiosInstance.get<Comment[]>(url).then((res) => res.data);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Компонент списка комментариев
 * @description Отображает сетку комментариев с анимацией и фильтрацией/сортировкой
 * @param {CommentsListProps} props - Пропсы компонента
 */
export const CommentsList: React.FC<CommentsListProps> = React.memo(
  ({ sortBy, filterType, animeId }) => {
    // Загрузка комментариев через SWR
    const { data: comments, isLoading, error } = useSWR(
      `/comment/get-all-comments-for-anime/${animeId}`,
      fetcher,
      {
        revalidateOnFocus: false,
        onSuccess: (data) => {
          console.log("Comments loaded:", data);
        },
      }
    );

    if (isLoading) {
      return (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(3)].map((_, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="relative flex flex-col h-full p-4 sm:p-6 rounded-xl border border-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white/5" />
                    <div className="h-4 w-24 bg-white/5 rounded" />
                  </div>
                  <div className="h-6 w-16 bg-white/5 rounded-full" />
                </div>
                <div className="mt-6 h-12 w-full bg-white/5 rounded" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          className="grid grid-cols-1 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Не удалось загрузить комментарии</span>
          </div>
        </motion.div>
      );
    }

    const filteredComments = useMemo(() => {
      let result = [...(comments || [])];
      if (filterType === "positive") {
        result = result.filter((comment) => comment.hearts > 0);
      }
      if (sortBy === "date") {
        result.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA; 
        });
      } else if (sortBy === "hearts") {
        result.sort((a, b) => b.hearts - a.hearts); 
      }
      return result;
    }, [comments, sortBy, filterType]);

    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <motion.div key={comment.id} variants={itemVariants}>
              <RecentComment comment={comment} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center text-white/40">
            Нет комментариев для отображения
          </div>
        )}
      </motion.div>
    );
  }
);

CommentsList.displayName = "CommentsList";

export default CommentsList;