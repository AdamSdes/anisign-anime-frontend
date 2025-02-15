'use client'
import Link from 'next/link'
import { transformValue } from '@/lib/utils/transforms'

interface Genre {
    genre_id: string
    name: string
    russian: string
}

interface AnimeProps {
    anime_id: number
    russian: string
    name: string
    poster_url: string
    score?: number
    aired_on: string
    kind: string
    episodes?: number
    description?: string
    genre_ids?: string[]
    rating?: string
    duration?: string
}

interface AnimeListItemProps {
    anime: AnimeProps
    genres?: Genre[]
}

const getGenreName = (genreId: string, genres?: Genre[]) => {
    if (!genres) return '...'
    const genre = genres.find(g => g.genre_id === genreId)
    return genre ? genre.russian || genre.name : '...'
}

export const AnimeListItem = ({ anime, genres }: AnimeListItemProps) => {
    const transliterate = (text: string) => {
        const ru = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
            'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k',
            'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
            'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
            'э': 'e', 'ю': 'yu', 'я': 'ya'
        }

        return text.toLowerCase().split('').map(char => ru[char as keyof typeof ru] || char).join('')
    }

    const generateAnimeUrl = (anime: AnimeProps) => {
        const title = anime.russian || anime.name || ''
        const slug = transliterate(title)
            .replace(/[^a-z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/ /g, '-')

        return `/anime/${anime.anime_id}${slug ? '-' + slug : ''}`
    }

    return (
        <Link href={generateAnimeUrl(anime)}>
            <div className="group flex gap-6 p-5 rounded-xl bg-white/[0.02] hover:bg-[#0A0A0A] border border-transparent hover:border-white/5 transition-all duration-300">
                <div className="relative w-[120px] flex-shrink-0">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                        <img
                            src={anime.poster_url}
                            alt={anime.russian || anime.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {anime.score && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                            <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#CCBAE4]">
                                <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/>
                            </svg>
                            <span className="text-xs font-medium text-white">{anime.score}</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-[15px] font-medium leading-snug text-white/90 group-hover:text-white transition-colors duration-200">
                            {anime.russian || anime.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-white/40">
                            <span>{new Date(anime.aired_on).getFullYear()}</span>
                            <span>•</span>
                            <span className="text-xs font-medium bg-white/5 px-2 py-0.5 rounded-full">
                                {transformValue('kind', anime.kind)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {anime.genre_ids?.map((genreId) => (
                            <span
                                key={genreId}
                                className="px-2 py-1 border text-[12px] rounded-full border-white/5 text-white/60 hover:text-white/80 hover:border-white/10 transition-colors duration-200"
                            >
                                {getGenreName(genreId, genres)}
                            </span>
                        ))}
                    </div>

                    {anime.description && (
                        <div className="text-[13px] leading-relaxed text-white/50 group-hover:text-white/60 transition-colors duration-200 line-clamp-3">
                            {anime.description}
                        </div>
                    )}

                    <div className="flex items-center gap-4 mt-4">
                        {anime.episodes && (
                            <div className="flex items-center gap-2 text-xs text-white/40">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 2V9C16 9.27 15.89 9.52 15.71 9.71L11.3 14.3C11.13 14.47 10.89 14.57 10.64 14.57C10.39 14.57 10.15 14.47 9.98 14.3L8.71 13.03C8.54 12.86 8.44 12.62 8.44 12.37C8.44 12.12 8.54 11.88 8.71 11.71L13.12 7.12C13.31 6.93 13.56 6.83 13.83 6.83H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>{anime.episodes} эпизодов</span>
                            </div>
                        )}
                        {anime.duration && (
                            <div className="flex items-center gap-2 text-xs text-white/40">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>{anime.duration}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
