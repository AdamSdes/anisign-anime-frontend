import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EpisodeSelect = ({
    episodes,
    selectedEpisode,
    onEpisodeChange,
    className = "w-[180px] bg-white/5",
    placeholder = "Выберите серию"
}) => {
    console.log('EpisodeSelect props:', {
        episodes,
        selectedEpisode,
        className,
        placeholder
    });

    if (!episodes?.length) {
        console.log('No episodes available');
        return null;
    }

    return (
        <Select value={selectedEpisode} onValueChange={onEpisodeChange}>
                <SelectTrigger className={className}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            <SelectContent>
                    <SelectGroup>
                        {episodes.map(episode => (
                            <SelectItem
                                key={episode.value}
                                value={episode.value}
                            >
                                { episode.label }
                            </SelectItem>
                        ))}
                    </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default EpisodeSelect;
