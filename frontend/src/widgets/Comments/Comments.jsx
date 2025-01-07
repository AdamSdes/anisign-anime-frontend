'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Добавляем импорт Link
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, Flag, MoreVertical, Bold, Italic, Strikethrough, AlertTriangle, Smile, Link2, Image as ImageIcon } from "lucide-react";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useGetUserAvatarQuery } from '@/features/auth/authApiSlice';
import { toast } from 'sonner'; // Добавляем импорт toast
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Добавляем константу на уровне модуля
const MAX_REPLY_LEVEL = 2;

// Добавляем моковые данные
const MOCK_COMMENTS = [
  {
    id: 1,
    author: {
      name: "Kirito",
      avatar: "https://i.pinimg.com/736x/f8/70/5b/f8705b8b62a5c4fa7b4b91f921dcac8f.jpg"
    },
    content: "Очень крутое аниме! Особенно понравилась **сцена битвы** в 5 эпизоде.",
    date: "2 часа назад",
    likes: 15,
    replies: [
      {
        id: 2,
        author: {
          name: "Asuna",
          avatar: "https://i.pinimg.com/736x/56/3b/47/563b4721987c786c58fa5ed347d647c8.jpg"
        },
        content: "Согласна! А еще ||главный злодей оказался предателем|| - это было неожиданно!",
        date: "1 час назад",
        likes: 7
      }
    ]
  },
  {
    id: 3,
    author: {
      name: "Naruto",
      avatar: "https://i.pinimg.com/736x/23/be/da/23bedae158deacf570a1131120eb7528.jpg"
    },
    content: "_Анимация просто топ!_ ~~Хотя саундтрек мог быть и получше~~",
    date: "3 часа назад",
    likes: 10
  }
];

const ReplyForm = ({ onSubmit, onCancel, replyingTo }) => (
  <form onSubmit={onSubmit} className="space-y-4 pl-14 mt-4">
    <Textarea
      placeholder={`Ответить ${replyingTo}...`}
      className="min-h-[80px] bg-white/[0.02] border-white/5 rounded-xl resize-none"
    />
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        onClick={onCancel}
        className="px-4 h-9 bg-white/5 text-white/60 hover:text-white rounded-xl"
      >
        Отмена
      </Button>
      <Button
        type="submit"
        className="px-4 h-9 bg-[#CCBAE4] text-black rounded-xl hover:opacity-90"
      >
        Ответить
      </Button>
    </div>
  </form>
);

const CommentEditor = ({ value, onChange, onSubmit }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = React.useRef(null);
  const { data: avatarUrl } = useGetUserAvatarQuery();
  const currentUser = useSelector(selectCurrentUser);

  // Предотвращаем всплытие события для кнопок форматирования
  const handleButtonClick = (e, action) => {
    e.preventDefault(); // Предотвращаем отправку формы
    action();
  };

  const handleFormat = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const formatTags = {
      bold: '**',
      italic: '_',
      strike: '~~',
      spoiler: '||'
    };

    const tag = formatTags[format];
    if (!tag) return;

    // Сохраняем текущую позицию курсора
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const newText = text.slice(0, start) +
      tag +
      text.slice(start, end) +
      tag +
      text.slice(end);

    onChange(newText);

    // Устанавливаем курсор после форматирования
    setTimeout(() => {
      textarea.focus();
      if (start === end) {
        // Если нет выделения, ставим курсор между тегами
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      } else {
        // Если есть выделение, выделяем текст вместе с тегами
        textarea.setSelectionRange(start, end + tag.length * 2);
      }
    }, 0);
  };

  const addEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const newText = value.slice(0, start) + emoji.native + value.slice(start);
    onChange(newText);

    // Устанавливаем курсор после эмодзи
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + emoji.native.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);

    setShowEmojiPicker(false);
  };

  return (
    <div className="space-y-2">
            <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Написать комментарий..."
        className="min-h-[100px] bg-white/[0.02] border-white/5 rounded-b-xl resize-none"
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 p-2 bg-white/[0.02] rounded-[10px] border border-white/5">
          <img
            src={avatarUrl || '/avatar_logo.png'}
            alt={currentUser}
            className="w-10 h-10 rounded-full object-cover"
          />
          <ToggleGroup type="multiple" className="flex gap-1">
            <ToggleGroupItem
              value="bold"
              onMouseDown={(e) => handleButtonClick(e, () => handleFormat('bold'))}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="italic"
              onMouseDown={(e) => handleButtonClick(e, () => handleFormat('italic'))}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="strike"
              onMouseDown={(e) => handleButtonClick(e, () => handleFormat('strike'))}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Strikethrough className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="w-[1px] h-6 bg-white/5" />

          <button
            type="button" // Явно указываем тип кнопки
            onMouseDown={(e) => handleButtonClick(e, () => handleFormat('spoiler'))}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
          >
            <AlertTriangle className="h-4 w-4" />
          </button>

          <div className="relative">
            <button
              type="button" // Явно указываем тип кнопки
              onMouseDown={(e) => {
                e.preventDefault();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
            >
              <Smile className="h-4 w-4" />
            </button>
            {showEmojiPicker && (
              <div
                className="absolute top-full left-0 z-50 mt-2"
                onMouseDown={(e) => e.preventDefault()} // Предотвращаем всплытие
              >
                <Picker
                  data={data}
                  onEmojiSelect={addEmoji}
                  theme="dark"
                  previewPosition="none"
                  skinTonePosition="none"
                />
              </div>
            )}
          </div>
          
        </div>
        <Button
              type="submit"
              className="px-6 h-10 bg-[#CCBAE4] h-[58px] text-black rounded-xl hover:opacity-90"
            >
              Отправить
            </Button>
      </div>


    </div>
  );
};

const CommentContent = ({ content }) => {
  const [revealedSpoilers, setRevealedSpoilers] = useState(new Set());

  const handleSpoilerClick = (index) => {
    setRevealedSpoilers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|_.*?_|~~.*?~~|\|\|.*?\|\|)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('~~') && part.endsWith('~~')) {
        return <del key={index}>{part.slice(2, -2)}</del>;
      }
      if (part.startsWith('||') && part.endsWith('||')) {
        const spoilerContent = part.slice(2, -2);
        const isRevealed = revealedSpoilers.has(index);

        return (
          <button
            key={index}
            onClick={() => handleSpoilerClick(index)}
            className={`
              px-1.5 py-0.5 rounded 
              ${isRevealed
                ? 'bg-transparent hover:bg-white/5'
                : 'bg-white/20 hover:bg-white/25'
              }
              transition-all duration-200
            `}
          >
            {isRevealed ? (
              <span className="text-white/90">{spoilerContent}</span>
            ) : (
              <span className="text-white/60 text-sm">спойлер</span>
            )}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <p className="text-white/80 leading-relaxed">
      {formatText(content)}
    </p>
  );
};

const ReportDialog = ({ isOpen, onClose, comment }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const reportReasons = [
    { id: 'spam', label: 'Спам', description: 'Нежелательная или рекламная информация' },
    { id: 'inappropriate', label: 'Неприемлемый контент', description: 'Контент содержит неприемлемые материалы' },
    { id: 'spoiler', label: 'Спойлер без предупреждения', description: 'Комментарий содержит спойлеры без соответствующей метки' },
    { id: 'harassment', label: 'Оскорбление', description: 'Агрессивное или оскорбительное поведение' },
    { id: 'other', label: 'Другое', description: 'Иная причина' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки жалобы
    onClose();
    // Показываем уведомление
    toast.success('Жалоба отправлена');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#060606] border border-white/5 p-6 rounded-2xl max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2">
            Пожаловаться на комментарий
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Автор: <span className="text-white/90">{comment?.author?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70">Причина</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full bg-white/5 border-white/10">
                <SelectValue placeholder="Выберите причину" />
              </SelectTrigger>
              <SelectContent className="bg-[#060606] border border-white/10">
                {reportReasons.map((reason) => (
                  <SelectItem
                    key={reason.id}
                    value={reason.id}
                    className="hover:bg-white/5 focus:bg-white/5"
                  >
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reason && (
              <p className="text-sm text-white/50 mt-1">
                {reportReasons.find(r => r.id === reason)?.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Дополнительное описание</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите причину подробнее..."
              className="min-h-[100px] bg-white/5 border-white/10"
            />
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-red-500/80 hover:bg-red-500 text-white"
              disabled={!reason}
            >
              Отправить жалобу
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CommentCard = ({ comment, onReply, onLike, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  return (
    <>
      <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="w-10 h-10 rounded-full object-cover border border-white/10"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-sm text-white/40">{comment.date}</span>
            </div>
            <button className="p-1 hover:bg-white/5 rounded-full transition-colors">
              <MoreVertical className="w-4 h-4 text-white/40" />
            </button>
          </div>
          <CommentContent content={comment.content} />
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-[#CCBAE4] transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>
            {level < MAX_REPLY_LEVEL && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ответить</span>
              </button>
            )}
            <button
              onClick={() => setShowReportDialog(true)}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 transition-colors"
            >
              <Flag className="w-4 х-4" />
              <span>Жалоба</span>
            </button>
          </div>

          {showReplyForm && (
            <ReplyForm
              onSubmit={(e) => {
                e.preventDefault();
                const content = e.target.elements[0].value;
                if (content.trim()) {
                  onReply(comment.id, content);
                  setShowReplyForm(false);
                }
              }}
              onCancel={() => setShowReplyForm(false)}
              replyingTo={comment.author.name}
            />
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4 pl-4 border-l border-white/5">
              {comment.replies.map(reply => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        comment={comment}
      />
    </>
  );
};

const UnauthorizedBlock = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/5 rounded-xl text-center">
    <div className="mb-4 text-white/50">
      <MessageSquare className="w-12 h-12" />
    </div>
    <h3 className="text-lg font-medium mb-2">Присоединяйтесь к обсуждению</h3>
    <p className="text-white/60 mb-4">Авторизуйтесь, чтобы оставлять комментарии</p>
    <Link href="/auth">
      <Button className="bg-[#CCBAE4] text-black hover:opacity-90">
        Войти
      </Button>
    </Link>
  </div>
);

const CommentsUsers = ({ animeId }) => {
  const [comments, setComments] = useState(MOCK_COMMENTS); // Используем моковые данные
  const [newComment, setNewComment] = useState('');
  const isAuthenticated = useSelector(state => state.auth.accessToken !== null);
  const currentUser = useSelector(selectCurrentUser);
  const { data: avatarUrl } = useGetUserAvatarQuery();

  useEffect(() => {
    // Имитация загрузки комментариев
    const fetchComments = async () => {
      // В реальном приложении здесь был бы API запрос
      setTimeout(() => {
        setComments(MOCK_COMMENTS);
      }, 1000);
    };

    fetchComments();
  }, [animeId]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Комментарий не может быть пустым');
      return;
    }

    const comment = {
      id: Date.now(),
      author: {
        name: currentUser,
        avatar: avatarUrl || '/avatar_logo.png'
      },
      content: newComment,
      date: 'Только что',
      likes: 0,
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    toast.success('Комментарий добавлен!');
  };

  const handleReply = (commentId, content) => {
    setComments(prev => {
      const addReply = (comments) => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), {
                id: Date.now(),
                author: {
                  name: currentUser,
                  avatar: avatarUrl || '/avatar_logo.png'
                },
                content,
                date: 'Только что',
                likes: 0,
                replies: []
              }]
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: addReply(comment.replies)
            };
          }
          return comment;
        });
      };
      return addReply(prev);
    });
  };

  const handleLike = (commentId) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    }));
  };

  return (
    <div className="space-y-6">

      {/* Форма добавления комментария */}
      {isAuthenticated ? (
        <div className="flex gap-4">
          <form onSubmit={handleSubmitComment} className="flex-1 space-y-4">
            <CommentEditor
              value={newComment}
              onChange={setNewComment}
            />
          </form>
        </div>
      ) : (
        <UnauthorizedBlock />
      )}

      {/* Список комментариев */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onLike={handleLike}
          />
        ))}
      </div>

    </div>
  );
};

export default CommentsUsers;
