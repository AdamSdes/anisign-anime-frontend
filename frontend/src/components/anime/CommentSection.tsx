'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MessageCircle,
  Heart,
  Reply,
  Send,
  Edit2,
  Bold,
  Italic,
  Underline,
  EyeOff,
  Smile,
  Code,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import commentService from '@/services/commentService';
import userService from '@/services/userService';
import { Comment } from '@/types/comment';
import { UserAvatar } from '@/components/user/UserAvatar';

interface CommentSectionProps {
  animeId: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  isReply?: boolean;
}

// Интерфейс для пользователя
interface UserInfo {
  id: string;
  username: string;
  nickname?: string;
  user_avatar?: string | null;
  email?: string;
  status?: string;
}

// Интерфейс для богатого редактора
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  rows?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, isReply = false }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const queryClient = useQueryClient();

  const isOwner = user?.id === comment.user_id;
  const isLiked = comment.user_liked_list?.includes(user?.id || '') || false;

  // Загружаем информацию о пользователе
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!comment.user_id) {
        setIsLoadingUser(false);
        return;
      }

      try {
        // Получаем информацию о пользователе по ID напрямую
        const userData = await userService.getUserById(comment.user_id);
        setUserInfo(userData);
      } catch (error) {
        console.error('Ошибка при загрузке информации о пользователе:', error);
        // В случае ошибки используем fallback
        setUserInfo({
          id: comment.user_id,
          username: 'Пользователь',
          nickname: 'Пользователь',
          email: '',
          status: 'user',
        });
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, [comment.user_id]);

  // Получаем отображаемое имя пользователя
  const getDisplayName = () => {
    if (isLoadingUser) return 'Загрузка...';
    if (!userInfo) return 'Пользователь';
    return userInfo.nickname || userInfo.username;
  };

  // Мутация для лайка
  const likeMutation = useMutation({
    mutationFn: () => commentService.likeComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.anime_id] });
    },
    onError: () => {
      toast.error('Ошибка при лайке комментария');
    },
  });

  // Мутация для дизлайка
  const dislikeMutation = useMutation({
    mutationFn: () => commentService.dislikeComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.anime_id] });
    },
    onError: () => {
      toast.error('Ошибка при удалении лайка');
    },
  });

  // Мутация для редактирования
  const editMutation = useMutation({
    mutationFn: (text: string) => commentService.updateComment(comment.id, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.anime_id] });
      setIsEditing(false);
      toast.success('Комментарий обновлен');
    },
    onError: () => {
      toast.error('Ошибка при обновлении комментария');
    },
  });

  const handleLike = () => {
    if (isLiked) {
      dislikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleEdit = () => {
    if (editText.trim()) {
      editMutation.mutate(editText.trim());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`${isReply ? 'ml-8 border-l border-white/5 pl-4' : ''}`}>
      <div className='bg-white/[0.02] border border-white/5 rounded-xl p-4'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center gap-3'>
            <UserAvatar
              user={
                userInfo
                  ? {
                      id: userInfo.id,
                      username: userInfo.username,
                      nickname: userInfo.nickname,
                      avatar_url: userInfo.user_avatar,
                      created_at: '',
                      updated_at: '',
                    }
                  : null
              }
              size='sm'
              className='w-8 h-8'
            />
            <div>
              <span className='text-sm font-medium text-white/90'>{getDisplayName()}</span>
              <span className='text-xs text-white/40 ml-2'>{formatDate(comment.created_at)}</span>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className='text-white/40 hover:text-white/80 transition-colors p-1 rounded-lg hover:bg-white/5'
            >
              <Edit2 size={14} />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className='space-y-3'>
            <div className='bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden'>
              <RichTextEditor
                value={editText}
                onChange={setEditText}
                placeholder='Ваш комментарий...'
                rows={3}
              />
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handleEdit}
                disabled={editMutation.isPending}
                className='px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Сохранить
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(comment.text);
                }}
                className='px-4 py-2 bg-white/[0.02] hover:bg-white/[0.04] text-white/60 rounded-xl text-sm font-medium transition-colors'
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className='mb-3'>
              <FormattedText text={comment.text} />
            </div>
            <div className='flex items-center gap-4'>
              <button
                onClick={handleLike}
                disabled={likeMutation.isPending || dislikeMutation.isPending}
                className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded-lg hover:bg-white/5 ${
                  isLiked ? 'text-red-400' : 'text-white/40 hover:text-white/80'
                }`}
              >
                <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{comment.likes}</span>
              </button>
              {!isReply && (
                <button
                  onClick={() => onReply(comment.id)}
                  className='flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors px-2 py-1 rounded-lg hover:bg-white/5'
                >
                  <Reply size={14} />
                  <span>Ответить</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 4,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Список смайликов
  const emojis = [
    '😀',
    '😂',
    '😍',
    '🤔',
    '😭',
    '😡',
    '👍',
    '👎',
    '❤️',
    '💔',
    '🔥',
    '💯',
    '👏',
    '🙈',
    '🙊',
    '🙉',
    '😴',
    '😎',
    '🤗',
    '😱',
    '🎉',
    '🎊',
    '💖',
    '✨',
    '⭐',
    '🌟',
    '💫',
    '🎈',
    '🎁',
    '🍰',
  ];

  // Функция для вставки текста в позицию курсора
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText =
      value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Восстанавливаем фокус и позицию курсора
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Функция для вставки смайлика
  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + emoji + value.substring(start);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    setShowEmojiPicker(false);
  };

  return (
    <div className='relative'>
      {/* Панель инструментов */}
      <div className='flex items-center gap-1 p-2 border-b border-white/5'>
        <button
          type='button'
          onClick={() => insertText('**', '**')}
          className='p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white/80 transition-colors'
          title='Жирный текст'
        >
          <Bold size={16} />
        </button>
        <button
          type='button'
          onClick={() => insertText('*', '*')}
          className='p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white/80 transition-colors'
          title='Курсив'
        >
          <Italic size={16} />
        </button>
        <button
          type='button'
          onClick={() => insertText('__', '__')}
          className='p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white/80 transition-colors'
          title='Подчеркивание'
        >
          <Underline size={16} />
        </button>
        <button
          type='button'
          onClick={() => insertText('`', '`')}
          className='p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white/80 transition-colors'
          title='Код'
        >
          <Code size={16} />
        </button>
        <button
          type='button'
          onClick={() => insertText('[spoiler]', '[/spoiler]')}
          className='p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white/80 transition-colors'
          title='Спойлер'
        >
          <EyeOff size={16} />
        </button>

        <div className='w-px h-6 bg-white/10 mx-1'></div>

        <div className='relative'>
          <button
            type='button'
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className='p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white/80 transition-colors'
            title='Смайлики'
          >
            <Smile size={16} />
          </button>

          {/* Панель смайликов */}
          {showEmojiPicker && (
            <div className='absolute top-full left-0 mt-1 bg-[#0A0A0A] border border-white/10 rounded-xl p-3 shadow-xl z-10 w-64'>
              <div className='grid grid-cols-6 gap-2'>
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => insertEmoji(emoji)}
                    className='w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-lg transition-colors'
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Текстовое поле */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className='w-full bg-transparent px-4 py-3 text-white/90 placeholder-white/40 resize-none focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      />

      {/* Закрытие панели смайликов при клике вне */}
      {showEmojiPicker && (
        <div className='fixed inset-0 z-0' onClick={() => setShowEmojiPicker(false)} />
      )}
    </div>
  );
};

// Компонент для рендера отформатированного текста
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const [showSpoilers, setShowSpoilers] = useState<Set<number>>(new Set());

  const toggleSpoiler = (index: number) => {
    const newShowSpoilers = new Set(showSpoilers);
    if (newShowSpoilers.has(index)) {
      newShowSpoilers.delete(index);
    } else {
      newShowSpoilers.add(index);
    }
    setShowSpoilers(newShowSpoilers);
  };

  // Простая функция для парсинга форматирования
  const parseText = (text: string) => {
    let result = text;
    let spoilerIndex = 0;

    // Заменяем спойлеры
    result = result.replace(/\[spoiler\](.*?)\[\/spoiler\]/g, (match, content) => {
      const index = spoilerIndex++;
      const isVisible = showSpoilers.has(index);
      return `<span class="spoiler" data-index="${index}" style="
        background: ${isVisible ? 'transparent' : '#333'};
        color: ${isVisible ? 'inherit' : 'transparent'};
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 4px;
        user-select: ${isVisible ? 'auto' : 'none'};
      ">${content}</span>`;
    });

    // Заменяем жирный текст
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Заменяем курсив
    result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Заменяем подчеркивание
    result = result.replace(/__(.*?)__/g, '<u>$1</u>');

    // Заменяем код
    result = result.replace(
      /`(.*?)`/g,
      '<code style="background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>'
    );

    return result;
  };

  return (
    <div
      className='text-white/80 text-sm leading-relaxed'
      dangerouslySetInnerHTML={{ __html: parseText(text) }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('spoiler')) {
          const index = parseInt(target.dataset.index || '0');
          toggleSpoiler(index);
        }
      }}
    />
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ animeId }) => {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  // Запрос комментариев
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', animeId],
    queryFn: () => commentService.getCommentsForAnime(animeId),
    staleTime: 1000 * 60 * 2, // 2 минуты
  });

  // Мутация для создания комментария
  const createCommentMutation = useMutation({
    mutationFn: (data: { text: string; type: 'comment' | 'reply'; replyToId?: string }) =>
      commentService.createComment(data.type, {
        anime_id: animeId,
        comment_text: data.text,
        reply_to_comment_id: data.replyToId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', animeId] });
      setNewComment('');
      setReplyText('');
      setReplyToId(null);
      toast.success('Комментарий добавлен');
    },
    onError: () => {
      toast.error('Ошибка при добавлении комментария');
    },
  });

  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      toast.error('Для добавления комментария необходимо войти в систему');
      return;
    }

    if (newComment.trim()) {
      createCommentMutation.mutate({
        text: newComment.trim(),
        type: 'comment',
      });
    }
  };

  const handleSubmitReply = () => {
    if (!isAuthenticated) {
      toast.error('Для добавления ответа необходимо войти в систему');
      return;
    }

    if (replyText.trim() && replyToId) {
      createCommentMutation.mutate({
        text: replyText.trim(),
        type: 'reply',
        replyToId,
      });
    }
  };

  const handleReply = (commentId: string) => {
    setReplyToId(commentId);
  };

  // Группируем комментарии и ответы
  const mainComments = comments.filter((comment) => comment.comment_type === 'comment');
  const replies = comments.filter((comment) => comment.comment_type === 'reply');

  const commentsWithReplies = mainComments.map((comment) => ({
    ...comment,
    replies: replies.filter((reply) => reply.reply_to_comment_id === comment.id),
  }));

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-8 h-8 bg-white/5 rounded-full flex items-center justify-center'>
            <MessageCircle size={16} className='text-white/60' />
          </div>
          <h3 className='text-xl font-semibold text-white/90'>Комментарии</h3>
        </div>
        <div className='animate-pulse space-y-4'>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='bg-white/[0.02] border border-white/5 rounded-xl h-24'></div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 bg-white/5 rounded-full flex items-center justify-center'>
          <MessageCircle size={16} className='text-white/60' />
        </div>
        <h3 className='text-xl font-semibold text-white/90'>Комментарии</h3>
        <span className='px-3 py-1 bg-white/[0.02] rounded-full text-sm text-white/60'>
          {comments.length}
        </span>
      </div>

      {/* Форма добавления комментария */}
      <div className='bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden'>
        <div className='p-5 pb-0'>
          <div className='flex items-start gap-3 mb-4'>
            <UserAvatar
              user={
                isAuthenticated && user
                  ? {
                      id: user.id,
                      username: user.username,
                      nickname: user.nickname,
                      avatar_url: user.user_avatar,
                      created_at: user.created_at || '',
                      updated_at: user.updated_at || '',
                    }
                  : null
              }
              size='sm'
              className='w-8 h-8 flex-shrink-0'
            />
            <div className='flex-1'>
              <RichTextEditor
                value={newComment}
                onChange={setNewComment}
                placeholder={
                  isAuthenticated
                    ? 'Поделитесь своим мнением об аниме...'
                    : 'Войдите в систему, чтобы оставить комментарий'
                }
                disabled={!isAuthenticated}
                rows={4}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end p-5 pt-0'>
          <button
            onClick={handleSubmitComment}
            disabled={!isAuthenticated || !newComment.trim() || createCommentMutation.isPending}
            className='flex items-center gap-2 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] disabled:bg-white/[0.02] disabled:text-white/40 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed'
          >
            <Send size={16} />
            Отправить
          </button>
        </div>
      </div>

      {/* Список комментариев */}
      <div className='space-y-4'>
        {commentsWithReplies.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4'>
              <MessageCircle size={24} className='text-white/20' />
            </div>
            <p className='text-white/40 mb-2'>Пока нет комментариев</p>
            <p className='text-sm text-white/30'>Будьте первым, кто оставит отзыв!</p>
          </div>
        ) : (
          commentsWithReplies.map((comment) => (
            <div key={comment.id} className='space-y-3'>
              <CommentItem comment={comment} onReply={handleReply} />

              {/* Ответы */}
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} onReply={handleReply} isReply />
              ))}

              {/* Форма ответа */}
              {replyToId === comment.id && (
                <div className='ml-8 border-l border-white/5 pl-4'>
                  <div className='bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden'>
                    <div className='p-4 pb-0'>
                      <div className='flex items-start gap-3 mb-3'>
                        <UserAvatar
                          user={
                            isAuthenticated && user
                              ? {
                                  id: user.id,
                                  username: user.username,
                                  nickname: user.nickname,
                                  avatar_url: user.user_avatar,
                                  created_at: user.created_at || '',
                                  updated_at: user.updated_at || '',
                                }
                              : null
                          }
                          size='xs'
                          className='w-6 h-6 flex-shrink-0'
                        />
                        <div className='flex-1'>
                          <RichTextEditor
                            value={replyText}
                            onChange={setReplyText}
                            placeholder='Ваш ответ...'
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-end gap-2 p-4 pt-0'>
                      <button
                        onClick={() => {
                          setReplyToId(null);
                          setReplyText('');
                        }}
                        className='px-3 py-1.5 text-white/60 hover:text-white/80 transition-colors text-sm rounded-lg hover:bg-white/5'
                      >
                        Отмена
                      </button>
                      <button
                        onClick={handleSubmitReply}
                        disabled={!replyText.trim() || createCommentMutation.isPending}
                        className='flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.12] disabled:bg-white/[0.02] disabled:text-white/40 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed'
                      >
                        <Send size={14} />
                        Ответить
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
