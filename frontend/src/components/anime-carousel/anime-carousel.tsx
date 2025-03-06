"use client";

import * as React from "react";
import { atom, useAtom } from "jotai"; 
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { EmblaCarousel } from "@/components/carousel/embla-carousel"; 
import { motion } from "framer-motion";
import { getBunnerUrl } from "@/lib/utils/banner";
import { User } from "@/shared/types/user";

// Атом для хранения данных пользователя
export const userAtom = atom<User | null>(null);

/**
 * Параметры карусели Embla
 * @see https://www.embla-carousel.com/api/options/
 */
interface EmblaOptions {
  align: "start" | "center" | "end";
  dragFree: boolean;
}

/**
 * Компонент карусели аниме с онгоингами
 * @description Отображает список лучших онгоингов с анимацией и баннером пользователя
 */
export const AnimeCarousel: React.FC = React.memo(() => {
  const OPTIONS: EmblaOptions = React.useMemo(
    () => ({ align: "start", dragFree: true }),
    []
  );

  const [user] = useAtom(userAtom);

  const bannerUrl = React.useMemo(
    () => getBunnerUrl(user?.user_banner),
    [user?.user_banner]
  );

  React.useEffect(() => {
    console.log("[AnimeCarousel] User:", user);
    console.log("[AnimeCarousel] Banner URL:", bannerUrl);
  }, [user, bannerUrl]);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const carouselVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <motion.section
      className="anim-list-background py-10"
      style={
        bannerUrl
          ? ({ "--profile-banner": `url(${bannerUrl})` } as React.CSSProperties)
          : undefined
      }
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <div className="container mx-auto">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-t from-accent to-purple-500 rounded-full" />
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Лучшие онгоинги</h2>
              <span className="text-xl" role="img" aria-label="fire">
                🔥
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group flex items-center gap-2 px-4 py-2 text-secondary hover:text-white transition-all duration-300 hover:bg-white/5"
          >
            <span>Смотреть все</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={carouselVariants}
        >
          <EmblaCarousel options={OPTIONS} />
        </motion.div>
      </div>
    </motion.section>
  );
});

AnimeCarousel.displayName = "AnimeCarousel";