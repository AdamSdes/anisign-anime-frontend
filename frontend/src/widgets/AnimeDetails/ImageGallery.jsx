'use client';
import React, { useState } from 'react';
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const ImageGallery = ({ screenshots = [] }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const previewImages = screenshots.slice(0, 4);

    const openModal = (index) => {
        setCurrentIndex(index);
        setSelectedImage(screenshots[index]);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'unset';
    };

    const navigate = (newDirection) => {
        setDirection(newDirection);
        const newIndex = newDirection === 1
            ? (currentIndex + 1) % screenshots.length
            : (currentIndex - 1 + screenshots.length) % screenshots.length;
        
        setCurrentIndex(newIndex);
        setSelectedImage(screenshots[newIndex]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'Escape') closeModal();
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    if (!screenshots || screenshots.length === 0) {
        return null;
    }

    return (
        <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Кадры</h3>
            {/* Превью изображений */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((image, index) => (
                    <motion.div
                        key={index}
                        onClick={() => openModal(index)}
                        className="relative aspect-video cursor-pointer overflow-hidden rounded-[14px] group"
                        whileHover={{ opacity: 0.5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <img
                            src={image}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Модальное окно */}
            <AnimatePresence initial={false} custom={direction}>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                        onClick={closeModal}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        {/* Кнопка закрытия */}
                        <motion.button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoClose size={24} />
                        </motion.button>

                        {/* Кнопка "Предыдущее" */}
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(-1);
                            }}
                            className="absolute left-4 text-white/80 hover:text-white transition-colors p-2 rounded-full bg-black/50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoChevronBack size={24} />
                        </motion.button>

                        {/* Изображение */}
                        <motion.div 
                            className="relative max-w-[90%] max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidenceThreshold) {
                                    navigate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    navigate(-1);
                                }
                            }}
                        >
                            <motion.img
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                src={selectedImage}
                                alt={`Screenshot ${currentIndex + 1}`}
                                className="max-h-[90vh] w-auto object-contain rounded-[14px]"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                            />
                        </motion.div>

                        {/* Кнопка "Следующее" */}
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(1);
                            }}
                            className="absolute right-4 text-white/80 hover:text-white transition-colors p-2 rounded-full bg-black/50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoChevronForward size={24} />
                        </motion.button>

                        {/* Индикатор */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80"
                        >
                            {currentIndex + 1} / {screenshots.length}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageGallery;
