import { Variants } from "framer-motion";

/**
 * Варианты анимации для контейнера списка аниме
 * @description Определяет анимацию появления всего списка с плавным затуханием
 */
export const animeListContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3, 
      when: "beforeChildren", 
      staggerChildren: 0.1, 
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Варианты анимации для элементов списка аниме (карточек)
 * @description Определяет анимацию появления отдельных карточек аниме
 */
export const animeListItemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15, 
    },
  },
};

/**
 * Варианты анимации для фильтров в боковой панели
 * @description Определяет анимацию появления секций фильтров
 */
export const filterSectionVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20, 
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Варианты анимации для пагинации
 * @description Определяет анимацию появления пагинации внизу списка
 */
export const paginationVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20, 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};