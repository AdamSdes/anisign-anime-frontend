import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { Anime } from '@/shared/types/anime';
import AnimeCard from '@/components/AnimeCard';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import { useAnimeStore } from '@/lib/stores/animeStore';

type TranslationFunction = ReturnType<typeof useTranslations>;

/**
 * Props для главной страницы со списком аниме
 */
interface HomeProps {
    initialAnimeList: Anime[];
}

/**
 * Главная страница
 * @param initialAnimeList Изначальный список аниме для отоборажения
 */
