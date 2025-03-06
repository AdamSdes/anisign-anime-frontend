"use client";

import React from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecentComment } from "./RecentComment";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { Skeleton } from "../ui/skeleton";
import { Author, Comment} from '@/shared/types/comment'

//Функция загрузки последних комментариев через SWR
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
 * Компонент последних комментариев
 * @description Отображает список последних комментариев с анимацией
 */
export const RecentComments: React.FC = () => {
  const router = useRouter();

  // Загрузка последних комментариев через SWR
  const { data: comments, isLoading, error } = useSWR(
    "/comment/recent", 
    fetcher,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        console.log("Recent comments loaded:", data);
      },
    }
  );

  if (isLoading) {
    return (
      <motion.section
        className="flex flex-col py-12 sm:py-16 md:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/5">
                <MessageCircle className="w-5 h-5 text-white/60" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Последние комментарии
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="relative flex flex-col h-full p-4 sm:p-6 rounded-xl border border-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <Skeleton className="w-10 h-10 sm:w-11 sm:h-11 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="mt-6 h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  if (error) {
    return (
      <motion.section
        className="flex flex-col py-12 sm:py-16 md:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
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
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="flex flex-col py-12 sm:py-16 md:py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/5">
              <MessageCircle className="w-5 h-5 text-white/60" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Последние комментарии
            </h2>
          </div>
          <Button
            variant="ghost"
            className="w-full sm:w-auto h-[50px] px-6 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-all duration-200 flex items-center justify-center gap-3"
            onClick={() => router.push("/comments")}
          >
            <span className="text-[14px] font-normal text-white/80">
              Все комментарии
            </span>
            <ChevronRight className="h-4 w-4 text-white/40" />
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                variants={itemVariants}
                className="flex-1 min-w-0"
              >
                <RecentComment comment={comment} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-white/40">
              Нет недавних комментариев
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-6 block sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            className="w-full h-[50px] rounded-xl border-white/10 hover:bg-white/5 text-white/60"
            onClick={() => router.push("/comments")}
          >
            Смотреть все комментарии
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

RecentComments.displayName = "RecentComments";

export default RecentComments;