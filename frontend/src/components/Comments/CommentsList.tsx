'use client';
import React from 'react';
import { motion } from 'framer-motion';
import RecentComment from './RecentComment';

interface CommentsListProps {
    sortBy: string;
    filterType: string;
}

const MOCK_COMMENTS = [
    {
        id: 1,
        author: {
            name: "Кирилл Петров",
            avatar: "/mock/anime2.jpg"
        },
        content: "Невероятный эпизод! Анимация просто на высшем уровне, особенно сцена битвы. Такого я еще не видел.",
        date: "2 часа назад",
        hearts: 12,
        animeId: "1",
        animeName: "Клинок, рассекающий демонов"
    },
    // ...добавьте больше моковых данных по необходимости
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { 
        opacity: 0,
        y: 20 
    },
    visible: { 
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const CommentsList = ({ sortBy, filterType }: CommentsListProps) => {
    return (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {MOCK_COMMENTS.map((comment) => (
                <motion.div
                    key={comment.id}
                    variants={itemVariants}
                >
                    <RecentComment comment={comment} />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default CommentsList;
