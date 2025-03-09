export interface Genre {
    id:  null | undefined;
    genre_id: string;
    name: string;
    russian: string;
}

export interface GenreSelectProps {
    className?: string;
    value?: string[];
    onChange?: (value: string[]) => void;
}