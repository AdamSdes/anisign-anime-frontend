"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { 
    Avatar,
    AvatarImage,
    AvatarFallback
} from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { useAuth } from "@/lib/stores/authStore";
import { getAvatarUrl } from "@/lib/utils/avatar";
import { mergeClass } from "@/lib/utils/mergeClass"
import EmojiPicker from "emoji-picker-react";
import {
  MessageCircle,
  Bold,
  Clock,
  EyeOff,
  Smile,
  Eye,
  ThumbsUp,
  MoreHorizontal,
  Reply,
  Edit,
  Trash2,
} from "lucide-react";

// Интерфейс пользователя
interface UserInfo {
  username: string;
  user_avatar: string;
  user_banner: string;
  nickname: string | null;
  id: string;
}

// Интерфейс комментария
interface Comment {
  id: string;
  text: string;
  user_id: string;
  anime_id: string;
  created_at?: string;
  likes?: number;
  user_liked_list: string[];
  reply_to_comment_id?: string;
  comment_type: "comment" | "reply";
  is_edited?: boolean;
  userInfo?: UserInfo;
}

// Интерфейс пропсов компонента AnimeComments
interface AnimeCommentsProps {
  animeId: string; // UUID аниме
}

// Интерфейс состояния форматирования комментария
interface CommentFormattingState {
  isBold: boolean;
  isSpoiler: boolean;
}

// Функция загрузки комментариев через SWR
const fetcher = (url: string) =>
  axiosInstance.get<Comment[]>(url).then((res: { data: any; }) => res.data);

// Компонент аватара комментария
const CommentAvatar: React.FC<{ userInfo?: UserInfo }> = React.memo(
  ({ userInfo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const avatarUrl = userInfo?.user_avatar
      ? getAvatarUrl(userInfo.user_avatar)
      : undefined;
    const fallbackText = userInfo?.nickname
      ? userInfo.nickname.slice(0, 2).toUpperCase()
      : userInfo?.username?.slice(0, 2).toUpperCase() || "AN";

    return (
      <Avatar className="relative h-10 w-10 ring-2 ring-white/[0.03] ring-offset-2 ring-offset-[#060606]">
        {isLoading && avatarUrl && (
          <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-full" />
        )}
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={userInfo?.username || "User avatar"}
            className={mergeClass(
              "aspect-square h-full w-full rounded-full object-cover",
              isLoading && "invisible"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        )}
        <AvatarFallback className="bg-white/[0.02] text-white/60 text-[14px] font-medium">
          {fallbackText}
        </AvatarFallback>
      </Avatar>
    );
  }
);
CommentAvatar.displayName = "CommentAvatar";

/**
 * Компонент мини-карточки профиля
 */
const ProfileMiniCard: React.FC<{ userInfo?: UserInfo }> = React.memo(
  ({ userInfo }) => {
    if (!userInfo) return null;

    const avatarUrl = userInfo.user_avatar
      ? getAvatarUrl(userInfo.user_avatar)
      : undefined;
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
              <AvatarImage src={avatarUrl} className="object-cover" />
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
  }
);
ProfileMiniCard.displayName = "ProfileMiniCard";

/**
 * Компонент текста комментария с форматированием
 */
const CommentText: React.FC<{ text: string }> = React.memo(({ text }) => {
  const [showSpoiler, setShowSpoiler] = useState<{ [key: number]: boolean }>({});

  const renderFormattedText = useCallback(
    (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*|\|\|.*?\|\||\[.*?\])/g);
      return parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={index} className="font-bold">
              {boldText}
            </strong>
          );
        }
        if (part.startsWith("||") && part.endsWith("||")) {
          const spoilerText = part.slice(2, -2);
          const isRevealed = showSpoiler[index] || false;
          return (
            <button
              key={index}
              onClick={() =>
                setShowSpoiler((prev) => ({ ...prev, [index]: !prev[index] }))
              }
              className={mergeClass(
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
              <span
                className={mergeClass(
                  "transition-colors",
                  isRevealed ? "text-white/90" : "text-transparent select-none"
                )}
              >
                {spoilerText}
              </span>
            </button>
          );
        }
        if (part.startsWith("[") && part.endsWith("]")) {
          const timestamp = part.slice(1, -1);
          return (
            <button
              key={index}
              onClick={() => console.log("Переход к таймкоду:", timestamp)}
              className="inline-flex items-center gap-1 px-1 text-[#CCBAE4] hover:underline"
            >
              <Clock className="w-3 h-3" />
              {timestamp}
            </button>
          );
        }
        return <span key={index}>{part}</span>;
      });
    },
    [showSpoiler]
  );

  return (
    <div className="whitespace-pre-wrap break-words">
      {renderFormattedText(text)}
    </div>
  );
});
CommentText.displayName = "CommentText";

/**
 * Компонент формы комментария
 */
const CommentForm: React.FC<{
  onSubmit: (text: string) => void;
  replyTo?: Comment | null;
  onCancelReply?: () => void;
  disabled?: boolean;
  initialText?: string;
}> = React.memo(
  ({ onSubmit, replyTo, onCancelReply, disabled = false, initialText = "" }) => {
    const [commentText, setCommentText] = useState(initialText);
    const { user } = useAuth();

    const handleSubmit = useCallback(() => {
      if (!commentText.trim()) return;
      onSubmit(commentText);
      setCommentText("");
    }, [commentText, onSubmit]);

    const insertFormatting = useCallback(
      (type: "bold" | "spoiler" | "timestamp") => {
        const textarea = document.querySelector(
          `textarea[data-reply-to="${replyTo?.id || "main"}"]`
        ) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = commentText.substring(start, end);

        let formattedText = "";
        switch (type) {
          case "bold":
            formattedText = `**${selectedText}**`;
            break;
          case "spoiler":
            formattedText = `||${selectedText}||`;
            break;
          case "timestamp":
            formattedText = `[${selectedText || "00:00"}]`;
            break;
        }

        const newText =
          commentText.substring(0, start) +
          formattedText +
          commentText.substring(end);
        setCommentText(newText);
      },
      [commentText, replyTo?.id]
    );

    const onEmojiClick = useCallback(
      (emojiObject: any) => {
        const textarea = document.querySelector(
          `textarea[data-reply-to="${replyTo?.id || "main"}"]`
        ) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newText =
          commentText.substring(0, start) +
          emojiObject.emoji +
          commentText.substring(start);
        setCommentText(newText);
      },
      [commentText, replyTo?.id]
    );

    return (
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <CommentAvatar userInfo={user ? user as UserInfo : undefined} />
        </div>
        <div className="flex-1 space-y-4">
          {replyTo && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <Reply className="h-4 w-4 text-white/40" />
              <span className="text-sm text-white/60">
                Ответ для {replyTo.userInfo?.nickname || replyTo.userInfo?.username}
              </span>
              {onCancelReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancelReply}
                  className="ml-auto h-7 px-3 text-xs hover:text-white/90"
                >
                  Отменить
                </Button>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <Textarea
                value={commentText}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCommentText(e.target.value)}
                placeholder={
                  replyTo ? "Написать ответ..." : "Написать комментарий..."
                }
                className="min-h-[120px] bg-white/[0.02] border-white/5 resize-none focus-visible:ring-1 focus-visible:ring-[#CCBAE4]/50 placeholder:text-white/40 rounded-xl pr-3"
                disabled={disabled}
                data-reply-to={replyTo?.id || "main"}
              />
              <div className="absolute right-3 bottom-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                <span className="text-xs text-white/30">Ctrl+Enter для отправки</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.02] border border-white/5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/5"
                          onClick={() => insertFormatting("bold")}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="bg-[#18181B] border-white/5"
                      >
                        <p>Жирный текст</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/5"
                          onClick={() => insertFormatting("spoiler")}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="bg-[#18181B] border-white/5"
                      >
                        <p>Спойлер</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/5"
                          onClick={() => insertFormatting("timestamp")}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="bg-[#18181B] border-white/5"
                      >
                        <p>Таймкод</p>
                      </TooltipContent>
                    </Tooltip>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/5"
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0 border-white/5 bg-[#18181B]">
                        <EmojiPicker onEmojiClick={onEmojiClick} width="100%" height={400} />
                      </PopoverContent>
                    </Popover>
                  </TooltipProvider>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={disabled || !commentText.trim()}
                className={mergeClass(
                  "h-10 px-6 rounded-lg font-medium transition-all duration-200",
                  "bg-[#CCBAE4] hover:bg-[#CCBAE4]/90 text-black shadow-lg shadow-[#CCBAE4]/10",
                  "disabled:bg-white/5 disabled:text-white/40 disabled:shadow-none"
                )}
              >
                {disabled ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Отправка...</span>
                  </div>
                ) : replyTo ? (
                  "Отправить ответ"
                ) : (
                  "Отправить"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CommentForm.displayName = "CommentForm";

/**
 * Основной компонент комментариев аниме
 * @description Управляет отображением и взаимодействием с комментариями
 */
const AnimeComments: React.FC<AnimeCommentsProps> = ({ animeId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [showReplyFormFor, setShowReplyFormFor] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, token, isAuthenticated } = useAuth();
  const [likeInProgress, setLikeInProgress] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [deleteInProgress, setDeleteInProgress] = useState<{
    [key: string]: boolean;
  }>({});

  // Загрузка комментариев через SWR
  const { data: comments, mutate, isLoading } = useSWR(
    `http://localhost:8000/comment/get-all-comments-for-anime/${animeId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      onSuccess: async (data) => {
        const commentsWithUserInfo = await Promise.all(
          data.map(async (comment: { user_id: any; }) => {
            try {
              const userResponse = await axiosInstance.get(
                `/user/get-user/${comment.user_id}`
              );
              return { ...comment, userInfo: userResponse.data };
            } catch (err) {
              console.error(`Error fetching user ${comment.user_id}:`, err);
              return comment;
            }
          })
        );
        mutate(commentsWithUserInfo, false);
      },
    }
  );

  const handleSubmitComment = useCallback(
    async (text: string, parentComment: Comment | null = null) => {
      if (isSubmitting || !token || !animeId) return;

      setIsSubmitting(true);
      try {
        const params = new URLSearchParams({
          anime_id: animeId,
          comment_text: text.trim(),
        });
        const commentType = parentComment ? "reply" : "comment";
        const endpoint = `http://localhost:8000/comment/create-comment-for-anime/${commentType}`;

        if (parentComment) {
          params.append("reply_to_comment_id", parentComment.id);
        }

        const response = await axiosInstance.post(
          `${endpoint}?${params.toString()}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status !== 200) {
          throw new Error("Failed to create comment");
        }

        setShowReplyFormFor(null);
        mutate();
      } catch (err) {
        console.error("Error creating comment:", err);
        setError("Не удалось создать комментарий");
      } finally {
        setIsSubmitting(false);
      }
    },
    [animeId, token, isSubmitting, mutate]
  );

  const handleLike = useCallback(
    async (comment: Comment) => {
      if (!token || !user?.id || likeInProgress[comment.id]) return;

      setLikeInProgress((prev) => ({ ...prev, [comment.id]: true }));
      const isLiked = comment.user_liked_list.includes(user.id);
      const endpoint = isLiked ? "dislike-comment" : "like-comment";

      try {
        const response = await axiosInstance.put(
          `http://localhost:8000/comment/${endpoint}/${comment.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status !== 200) {
          throw new Error("Failed to update like status");
        }

        mutate();
      } catch (err) {
        console.error("Error updating like:", err);
        setError("Не удалось обновить лайк");
      } finally {
        setLikeInProgress((prev) => ({ ...prev, [comment.id]: false }));
      }
    },
    [token, user?.id, mutate]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (!token || deleteInProgress[commentId]) return;

      setDeleteInProgress((prev) => ({ ...prev, [commentId]: true }));
      try {
        const response = await axiosInstance.delete(
          `http://localhost:8000/comment/delete-comment/${commentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status !== 200) {
          throw new Error("Failed to delete comment");
        }

        mutate((prev: any[]) =>
          prev?.filter(
            (c) => c.id !== commentId && c.reply_to_comment_id !== commentId
          )
        );
      } catch (err) {
        console.error("Error deleting comment:", err);
        setError("Не удалось удалить комментарий");
      } finally {
        setDeleteInProgress((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    [token, mutate]
  );

  const handleEditComment = useCallback(
    async (commentId: string, newText: string) => {
      if (!token || isSubmitting) return;

      setIsSubmitting(true);
      try {
        const response = await axiosInstance.put(
          `/comment/update-comment/${commentId}?text=${encodeURIComponent(newText)}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status !== 200) {
          throw new Error("Failed to edit comment");
        }

        mutate((prev: { id: string; }[]) =>
          prev?.map((c: { id: string; }) =>
            c.id === commentId ? { ...c, text: newText, is_edited: true } : c
          )
        );
        setEditingComment(null);
      } catch (err) {
        console.error("Error editing comment:", err);
        setError("Не удалось отредактировать комментарий");
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, isSubmitting, mutate]
  );

  const groupedComments = useMemo(() => {
    const grouped: { [key: string]: Comment[] } = {};
    const topLevelComments: Comment[] = [];

    comments?.forEach((comment: Comment) => {
      if (comment.reply_to_comment_id) {
        if (!grouped[comment.reply_to_comment_id]) {
          grouped[comment.reply_to_comment_id] = [];
        }
        grouped[comment.reply_to_comment_id].push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });

    return { topLevelComments, replies: grouped };
  }, [comments]);

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {error && (
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
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-xl border border-white/5 bg-[rgba(255,255,255,0.02)] backdrop-blur-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-[#CCBAE4]" />
              <div className="flex items-baseline gap-2">
                <h3 className="text-[18px] font-semibold text-white/90">
                  Комментарии
                </h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] text-xs text-white/60">
                  <span>{comments?.length || 0}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.02] border border-white/5">
              <Button
                variant="ghost"
                size="sm"
                className="text-[13px] text-white/40 hover:text-white/90 hover:bg-white/5"
              >
                Новые
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[13px] text-white/40 hover:text-white/90 hover:bg-white/5"
              >
                Старые
              </Button>
            </div>
          </div>

          {isAuthenticated && (
            <CommentForm onSubmit={handleSubmitComment} disabled={isSubmitting} />
          )}
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-6"
                >
                  <div className="flex gap-4 items-start">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : groupedComments.topLevelComments.length > 0 ? (
            groupedComments.topLevelComments.map((comment) => (
              <motion.div
                key={comment.id}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.03] transition-colors duration-200">
                  <div className="flex gap-4 items-start">
                    <Popover>
                      <PopoverTrigger>
                        <CommentAvatar userInfo={comment.userInfo} />
                      </PopoverTrigger>
                      <PopoverContent className="w-80 border-white/[0.03] bg-[#060606] p-4">
                        <ProfileMiniCard userInfo={comment.userInfo} />
                      </PopoverContent>
                    </Popover>

                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="font-medium text-white/90">
                          {comment.userInfo?.nickname || comment.userInfo?.username}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-white/40">
                          <Clock className="h-4 w-4" />
                          {comment.created_at
                            ? new Date(comment.created_at).toLocaleString("ru-RU")
                            : ""}
                          {comment.is_edited && (
                            <span className="ml-2 text-white/30">(изменено)</span>
                          )}
                        </span>
                      </div>

                      {editingComment?.id === comment.id ? (
                        <CommentForm
                          onSubmit={(text) => handleEditComment(comment.id, text)}
                          disabled={isSubmitting}
                          initialText={comment.text}
                          onCancelReply={() => setEditingComment(null)}
                        />
                      ) : (
                        <div className="text-white/80">
                          <CommentText text={comment.text} />
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              className={mergeClass(
                                "flex items-center gap-2 text-white/40 hover:text-white/90 transition-colors",
                                {
                                  "cursor-not-allowed opacity-50":
                                    likeInProgress[comment.id],
                                }
                              )}
                              onClick={() => handleLike(comment)}
                              disabled={!token || likeInProgress[comment.id]}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.div
                                animate={{
                                  scale: comment.user_liked_list.includes(user?.id || "")
                                    ? [1, 1.2, 1]
                                    : 1,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <ThumbsUp
                                  className={mergeClass("h-4 w-4", {
                                    "text-blue-500 fill-blue-500": comment.user_liked_list.includes(
                                      user?.id || ""
                                    ),
                                  })}
                                />
                              </motion.div>
                              <AnimatePresence mode="wait">
                                <motion.span
                                  key={comment.likes ?? 0}
                                  initial={{ y: -10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: 10, opacity: 0 }}
                                  className="text-[13px]"
                                >
                                  {comment.likes ?? 0}
                                </motion.span>
                              </AnimatePresence>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {!token ? "Войдите, чтобы поставить лайк" : "Нравится"}
                          </TooltipContent>
                        </Tooltip>

                        {isAuthenticated && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowReplyFormFor(comment.id);
                                  setReplyingTo(comment);
                                }}
                                className="flex items-center gap-2 text-white/40 hover:text-white/90"
                              >
                                <Reply className="h-4 w-4" />
                                <span className="text-[13px]">
                                  {groupedComments.replies[comment.id]?.length || 0}{" "}
                                  Ответов
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ответить</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>

                  {isAuthenticated && comment.user_id === user?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-6 top-6 h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingComment(comment)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Редактировать</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(comment.id)}
                          className="flex items-center gap-2 text-red-500"
                        >
                          {deleteInProgress[comment.id] ? (
                            <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span>Удалить</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {isAuthenticated && showReplyFormFor === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-8 pl-6"
                  >
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                      <CommentForm
                        onSubmit={(text) => handleSubmitComment(text, comment)}
                        replyTo={comment}
                        onCancelReply={() => setShowReplyFormFor(null)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </motion.div>
                )}

                {groupedComments.replies[comment.id]?.length > 0 && (
                  <div className="ml-8 space-y-4 border-l-2 border-white/5 pl-6">
                    {groupedComments.replies[comment.id].map((reply) => (
                      <div
                        key={reply.id}
                        className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-6"
                      >
                        <div className="flex gap-4 items-start">
                          <Popover>
                            <PopoverTrigger>
                              <CommentAvatar userInfo={reply.userInfo} />
                            </PopoverTrigger>
                            <PopoverContent className="w-80 border-white/[0.03] bg-[#060606] p-4">
                              <ProfileMiniCard userInfo={reply.userInfo} />
                            </PopoverContent>
                          </Popover>

                          <div className="flex-1">
                            <div className="mb-4 flex items-center gap-3">
                              <span className="font-medium text-white/90">
                                {reply.userInfo?.nickname || reply.userInfo?.username}
                              </span>
                              <span className="flex items-center gap-1 text-sm text-white/40">
                                <Clock className="h-4 w-4" />
                                {reply.created_at
                                  ? new Date(reply.created_at).toLocaleString("ru-RU")
                                  : ""}
                                {reply.is_edited && (
                                  <span className="ml-2 text-white/30">
                                    (изменено)
                                  </span>
                                )}
                              </span>
                            </div>

                            {editingComment?.id === reply.id ? (
                              <CommentForm
                                onSubmit={(text) => handleEditComment(reply.id, text)}
                                disabled={isSubmitting}
                                initialText={reply.text}
                                onCancelReply={() => setEditingComment(null)}
                              />
                            ) : (
                              <div className="text-white/80">
                                <CommentText text={reply.text} />
                              </div>
                            )}

                            <div className="mt-4 flex items-center gap-4">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.button
                                    className={mergeClass(
                                      "flex items-center gap-2 text-white/40 hover:text-white/90 transition-colors",
                                      {
                                        "cursor-not-allowed opacity-50":
                                          likeInProgress[reply.id],
                                      }
                                    )}
                                    onClick={() => handleLike(reply)}
                                    disabled={!token || likeInProgress[reply.id]}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <motion.div
                                      animate={{
                                        scale: reply.user_liked_list.includes(user?.id || "")
                                          ? [1, 1.2, 1]
                                          : 1,
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ThumbsUp
                                        className={mergeClass("h-4 w-4", {
                                          "text-blue-500 fill-blue-500": reply.user_liked_list.includes(
                                            user?.id || ""
                                          ),
                                        })}
                                      />
                                    </motion.div>
                                    <AnimatePresence mode="wait">
                                      <motion.span
                                        key={reply.likes ?? 0}
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        className="text-[13px]"
                                      >
                                        {reply.likes ?? 0}
                                      </motion.span>
                                    </AnimatePresence>
                                  </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {!token ? "Войдите, чтобы поставить лайк" : "Нравится"}
                                </TooltipContent>
                              </Tooltip>

                              {isAuthenticated && reply.user_id === user?.id && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-6 top-6 h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => setEditingComment(reply)}
                                      className="flex items-center gap-2"
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span>Редактировать</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteComment(reply.id)}
                                      className="flex items-center gap-2 text-red-500"
                                    >
                                      {deleteInProgress[reply.id] ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                      <span>Удалить</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-white/[0.03]">
                  <MessageCircle className="w-6 h-6 text-white/40" />
                </div>
                <div className="space-y-1">
                  <p className="text-white/40">Пока нет комментариев</p>
                  <p className="text-sm text-white/30">
                    Будьте первым, кто оставит комментарий!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AnimeComments;