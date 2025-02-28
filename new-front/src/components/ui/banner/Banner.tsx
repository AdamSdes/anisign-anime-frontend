import { useTranslations } from 'next-intl';
import { getPopularAnime } from '@/services/anime';
import { Anime } from '@/shared/types/anime';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play } from '@/shared/icons';