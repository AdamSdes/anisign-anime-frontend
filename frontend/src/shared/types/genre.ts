export interface Genre {
    genreId: string;
    name: string;
    russian: string;
}

export interface GenreSelectProps {
    className?: string;
    value?: string[];
    onChange?: (value: string[]) => void;
}