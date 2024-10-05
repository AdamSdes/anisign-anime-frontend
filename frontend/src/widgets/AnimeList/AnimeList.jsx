import AnimeCard from './AnimeCard';

const AnimeList = ({ animeList }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-6 group">
            {animeList.map((anime, index) => (
                <div
                    key={index}
                    className="relative group-hover:opacity-50 hover:!opacity-100 transition-opacity duration-300"
                >
                    <AnimeCard anime={anime} />
                </div>
            ))}
        </div>
    );
};

export default AnimeList;
