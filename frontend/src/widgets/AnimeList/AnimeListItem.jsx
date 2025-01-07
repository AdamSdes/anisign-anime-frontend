const AnimeListItem = ({ anime, genres }) => {
    const transliterate = (text) => {
        const ru = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
            'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k',
            'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
            'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
            'э': 'e', 'ю': 'yu', 'я': 'ya'
        };

        return text.toLowerCase().split('').map(char => ru[char] || char).join('');
    };

    const generateAnimeUrl = (anime) => {
        const title = anime.russian || anime.name || '';
        const slug = transliterate(title)
            .replace(/[^a-z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/ /g, '-');

        return `/anime/${anime.anime_id}${slug ? '-' + slug : ''}`;
    };

    return (
        <Link href={generateAnimeUrl(anime)}>
            {/* ...existing code... */}
        </Link>
    );
};
