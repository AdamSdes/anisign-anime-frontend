'use client';
import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const MOCK_REVIEWS = [
  {
    id: 1,
    author: {
      name: "Микаса",
      avatar: "/avatars/mikasa.jpg"
    },
    rating: 9,
    content: "Потрясающая история и анимация. Персонажи прописаны отлично.",
    likes: 42,
    dislikes: 3,
    date: "1 день назад"
  },
  {
    id: 2,
    author: {
      name: "Леви",
      avatar: "/avatars/levi.jpg"
    },
    rating: 8,
    content: "Хороший сюжет, но некоторые моменты затянуты.",
    likes: 28,
    dislikes: 5,
    date: "3 дня назад"
  }
];

const Reviews = ({ animeId }) => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [newReview, setNewReview] = useState({ rating: 0, content: '' });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!newReview.content.trim() || newReview.rating === 0) {
      toast.error('Пожалуйста, укажите оценку и напишите отзыв');
      return;
    }

    const review = {
      id: Date.now(),
      author: {
        name: currentUser,
        avatar: avatarUrl || '/avatar_logo.png'
      },
      ...newReview,
      likes: 0,
      dislikes: 0,
      date: 'Только что'
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 0, content: '' });
    toast.success('Отзыв добавлен!');
  };

  return (
    <div className="space-y-6">
      {/* Форма добавления отзыва */}
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setNewReview(prev => ({ ...prev, rating }))}
              className={`p-2 rounded-full ${
                newReview.rating >= rating ? 'text-yellow-400' : 'text-white/20'
              }`}
            >
              <Star className="w-5 h-5" />
            </button>
          ))}
        </div>
        <textarea
          value={newReview.content}
          onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Напишите ваш отзыв..."
          className="w-full min-h-[100px] bg-white/[0.02] border border-white/5 rounded-xl p-4"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[#CCBAE4] text-black rounded-xl hover:opacity-90"
        >
          Отправить отзыв
        </button>
      </form>

      {/* Список отзывов */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={review.author.avatar}
                  alt={review.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{review.author.name}</h3>
                  <p className="text-sm text-white/40">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center text-yellow-400">
                <Star className="w-5 h-5" />
                <span className="ml-1">{review.rating}</span>
              </div>
            </div>
            <p className="mt-4 text-white/80">{review.content}</p>
            <div className="flex items-center gap-4 mt-4">
              <button className="flex items-center gap-1 text-white/40 hover:text-[#CCBAE4]">
                <ThumbsUp className="w-4 h-4" />
                <span>{review.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-white/40 hover:text-red-400">
                <ThumbsDown className="w-4 h-4" />
                <span>{review.dislikes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
