'use client';
import React, { useState } from 'react';
import { Star, ThumbsUp, Flag } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useGetUserAvatarQuery } from '@/features/auth/authApiSlice';
import { CommentEditor } from '@/components/shared/CommentEditor';

const StarRating = ({ rating, onChange }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                    key={star}
                    onClick={() => onChange(star)}
                    className={`p-1 rounded-full hover:bg-white/10 transition-colors`}
                >
                    <Star 
                        className={`w-5 h-5 ${
                            star <= rating 
                                ? 'fill-[#FDE5B9] text-[#FDE5B9]' 
                                : 'text-white/20'
                        }`}
                    />
                </button>
            ))}
            <span className="ml-2 text-sm text-white/60">
                {rating > 0 ? `${rating} из 10` : 'Оценка'}
            </span>
        </div>
    );
};

const ReviewCard = ({ review, onLike }) => {
    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-start gap-4">
                <Avatar
                    src={review.author.avatar}
                    alt={review.author.name}
                    className="w-10 h-10 rounded-full border border-white/10"
                />
                <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-medium">{review.author.name}</h3>
                            <p className="text-sm text-white/40">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDE5B9]/10">
                            <Star className="w-4 h-4 text-[#FDE5B9]" />
                            <span className="text-[#FDE5B9]">{review.rating}</span>
                        </div>
                    </div>
                    
                    <p className="text-white/80">{review.content}</p>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => onLike(review.id)}
                            className="flex items-center gap-2 text-sm text-white/40 hover:text-[#CCBAE4] transition-colors"
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{review.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 transition-colors">
                            <Flag className="w-4 w-4" />
                            <span>Жалоба</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Reviews = ({ animeId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);
    const currentUser = useSelector(selectCurrentUser);
    const { data: avatarUrl } = useGetUserAvatarQuery();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newReview.trim() || !rating) return;

        const review = {
            id: Date.now(),
            author: {
                name: currentUser,
                avatar: avatarUrl || '/avatar_logo.png'
            },
            content: newReview,
            rating: rating,
            date: 'Только что',
            likes: 0
        };

        setReviews(prev => [review, ...prev]);
        setNewReview('');
        setRating(0);
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <Avatar
                        src={avatarUrl || '/avatar_logo.png'}
                        alt={currentUser}
                        className="w-10 h-10 rounded-full border border-white/10"
                    />
                    <div className="flex-1 space-y-4">
                        <StarRating rating={rating} onChange={setRating} />
                        <CommentEditor 
                            value={newReview}
                            onChange={setNewReview}
                        />
                        <div className="flex justify-end">
                            <Button 
                                type="submit"
                                disabled={!rating || !newReview.trim()}
                                className="px-6 h-10 bg-[#CCBAE4] text-black rounded-xl hover:opacity-90 disabled:opacity-50"
                            >
                                Отправить отзыв
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="space-y-4">
                {reviews.map(review => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onLike={(id) => {
                            setReviews(prev => prev.map(review => 
                                review.id === id 
                                    ? { ...review, likes: review.likes + 1 }
                                    : review
                            ));
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Reviews;
