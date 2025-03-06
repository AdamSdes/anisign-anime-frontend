"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

/**
 * Интерфейс пропсов компонента ScrollToPlayerButton
 * @description Пока пропсы не требуются, но добавлен для расширяемости
 */
interface ScrollToPlayerButtonProps {
  
}

/**
 * Компонент кнопки для прокрутки к плееру
 * @description Прокручивает страницу к секции плеера с плавной анимацией
 * @param {ScrollToPlayerButtonProps} props - Пропсы компонента
 */
export const ScrollToPlayerButton: React.FC<ScrollToPlayerButtonProps> = React.memo(() => {
  /**
   * Обработчик клика по кнопке
   * @description Прокручивает к элементу с ID "player" или выводит предупреждение
   */
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const playerSection = document.getElementById("player");
    if (playerSection) {
      playerSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      console.warn("[ScrollToPlayerButton] Элемент с ID 'player' не найден");
    }
  }, []);

  return (
    <motion.button
      whileHover={{ opacity: 0.8 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 h-[54px] bg-[#CCBAE4] hover:opacity-90 text-black font-medium rounded-xl px-5 transition-all duration-300"
    >
      <Play className="h-5 w-5" />
      <span>Смотреть</span>
    </motion.button>
  );
});

ScrollToPlayerButton.displayName = "ScrollToPlayerButton";

export default ScrollToPlayerButton;