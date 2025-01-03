import { Avatar, AvatarFallback, AvatarImage } from "@/shared/shadcn-ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AnimeCard = ({ backgroundImage, title, username, avatar, genres }) => {
    const getGenreName = (genreId) => {
        if (!genres || !Array.isArray(genres)) return '';
        const genre = genres.find(g => String(g.genre_id) === String(genreId));
        return genre ? genre.russian || genre.name : '';
    };

    const genresList = genres
        ?.map(id => getGenreName(id))
        .filter(name => name)
        .join(', ');

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="relative flex-shrink-0 w-full sm:w-[220px] h-[308px] rounded-[14px] overflow-hidden group transition-all duration-300">
                        {/* Фоновое изображение с эффектом увеличения при наведении */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out transform group-hover:scale-125"
                            style={{ backgroundImage: `url(${backgroundImage})` }}
                        ></div>

                        {/* Градиент для затемнения нижней части карточки */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                        {/* Контент внизу карточки */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                            <p className="text-white font-semibold mb-2 text-xs sm:text-base text-start">{title}</p>
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Аватар пользователя */}
                                <Avatar className="w-[30px] sm:w-[35px] h-[30px] sm:h-[35px]">
                                    <AvatarImage src={avatar} alt={username} />
                                    <AvatarFallback>AS</AvatarFallback>
                                </Avatar>

                                {/* Имя пользователя */}
                                <p className="text-white text-xs sm:text-sm">{username}</p>
                            </div>
                        </div>
                    </button>
                </TooltipTrigger>
                <TooltipContent 
                    side="top" 
                    className="max-w-[300px] bg-[#060606]/95 backdrop-blur-xl border-white/5 p-3"
                >
                    <div className="space-y-2">
                        <p className="font-medium">{title}</p>
                        {genresList && (
                            <p className="text-sm text-white/60">{genresList}</p>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default AnimeCard;
