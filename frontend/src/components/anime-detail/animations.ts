import { Variants } from "framer-motion";

/**
 * Варианты анимации для контейнера детальной страницы аниме
 * @description Определяет анимацию появления контейнера с задержкой для дочерних элементов
 */
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, 
    },
  },
};

/**
 * Варианты анимации для элементов детальной страницы аниме
 * @description Определяет анимацию появления отдельных элементов
 */
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0, 
    transition: {
      type: "spring", 
      stiffness: 100, 
    },
  },
};