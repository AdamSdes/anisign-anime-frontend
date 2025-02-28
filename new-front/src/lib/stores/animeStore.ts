import { atom, useAtom } from 'jotai';
import { Anime } from '@/shared/types/anime';

// Атом состояния для списка аниме
const animeListAtom = atom<Anime[]>([]);

// Хук для работы с состоянием списка аниме
export const useAnimeStore = () => {
  const [animeList, setAnimeList] = useAtom(animeListAtom);

  const applyFilters = (filteredList: Anime[]) => {
    setAnimeList(filteredList);
  };

  return {
    animeList,
    setAnimeList,
    applyFilters,
  };
};