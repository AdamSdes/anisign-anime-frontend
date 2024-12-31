import Link from 'next/link';
import { useState } from 'react';
import {Image} from "@nextui-org/image";

const AnimeCard = ({ anime }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="relative flex w-full flex-col gap-2">
            <div className="relative w-full overflow-hidden rounded-[14px] bg-muted" style={{ aspectRatio: '3 / 4' }}>
                <Link href={`/anime/${anime.id}`}>
                    <div className="">
                        {!imgError ? (
                            <img
                                isZoomed
                                className="w-full h-full object-cover"
                                alt={anime.title}
                                src={anime.anime_images[0]}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-default-100">
                                <span className="text-default-500">Изображение недоступно</span>
                            </div>
                        )}
                    </div>
                </Link>
            </div>
            <div className="flex flex-col gap-1">
                <Link href={`/anime/${anime.id}`}>
                    <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                        {anime.title}
                    </h3>
                </Link>
                <div className="flex gap-2 text-sm text-default-500">
                    <span>{anime.year}</span>
                    <span>•</span>
                    <span>{anime.episodes_count} эп.</span>
                    {anime.last_season > 1 && (
                        <>
                            <span>•</span>
                            <span>Сезон {anime.last_season}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnimeCard;
