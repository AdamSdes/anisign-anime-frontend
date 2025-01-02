import { Avatar, AvatarFallback, AvatarImage } from "@/shared/shadcn-ui/avatar";

const AnimeCard = ({ backgroundImage, title, username, avatar }) => {
    return (
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
    );
};

export default AnimeCard;
