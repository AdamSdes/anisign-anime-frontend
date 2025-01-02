'use client';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play, Volume2 } from "lucide-react";

const VideoPlayer = ({ shikimoriId }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [episodes, setEpisodes] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [selectedEpisode, setSelectedEpisode] = useState('1');
    const [selectedTranslation, setSelectedTranslation] = useState(null);
    const [playerInfo, setPlayerInfo] = useState(null);

    useEffect(() => {
        if (!shikimoriId) {
            setError(true);
            setLoading(false);
            return;
        }

        const container = document.getElementById('kodik-player');
        if (container) {
            container.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.src = `//kodik.info/find-player?shikimoriID=${shikimoriId}`;
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            iframe.allow = 'autoplay *; fullscreen *';

            const handleMessage = (event) => {
                if (event.origin.includes('kodik.info')) {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('Kodik data:', data);
                        
                        if (data.type === 'kodik_player_info') {
                            setPlayerInfo(data);
                            
                            // Обработка серий
                            const totalEpisodes = parseInt(data.episodes || 1);
                            const episodesList = Array.from({ length: totalEpisodes }, (_, i) => ({
                                value: String(i + 1),
                                label: `Серия ${i + 1}`
                            }));
                            setEpisodes(episodesList);

                            // Обработка озвучек
                            if (data.translations) {
                                const translationList = Object.entries(data.translations).map(([id, name]) => ({
                                    value: id,
                                    label: name
                                }));
                                setTranslations(translationList);
                                setSelectedTranslation(translationList[0]?.value);
                            }

                            setLoading(false);
                        }
                    } catch (e) {
                        console.error('Error parsing player data:', e);
                    }
                }
            };

            window.addEventListener('message', handleMessage);
            container.appendChild(iframe);

            return () => {
                window.removeEventListener('message', handleMessage);
            };
        }
    }, [shikimoriId]);

    useEffect(() => {
        if (selectedEpisode && selectedTranslation) {
            const container = document.getElementById('kodik-player');
            if (container) {
                container.innerHTML = '';
                const iframe = document.createElement('iframe');
                iframe.src = `//kodik.info/find-player?shikimoriID=${shikimoriId}&episode=${selectedEpisode}&translation=${selectedTranslation}`;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.frameBorder = '0';
                iframe.allowFullscreen = true;
                iframe.allow = 'autoplay *; fullscreen *';
                container.appendChild(iframe);
            }
        }
    }, [selectedEpisode, selectedTranslation, shikimoriId]);

    if (error) {
        return (
            <div className="w-full aspect-video rounded-[14px] overflow-hidden bg-gray-900 flex items-center justify-center">
                <div className="text-white/80 text-center">
                    <p className="text-lg mb-2">Видео не найдено</p>
                    <p className="text-sm">Попробуйте позже</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                {episodes.length > 1 && (
                    <Select 
                        value={selectedEpisode} 
                        onValueChange={setSelectedEpisode}
                    >
                        <SelectTrigger className="w-[180px] bg-white/5">
                            <SelectValue placeholder="Выберите серию" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {episodes.map(episode => (
                                    <SelectItem 
                                        key={episode.value} 
                                        value={episode.value}
                                    >
                                        {episode.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}

                {translations.length > 0 && (
                    <Select 
                        value={selectedTranslation} 
                        onValueChange={setSelectedTranslation}
                    >
                        <SelectTrigger className="w-[250px] bg-white/5">
                            <SelectValue placeholder="Выберите озвучку" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {translations.map(translation => (
                                    <SelectItem 
                                        key={translation.value} 
                                        value={translation.value}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Volume2 className="h-4 w-4" />
                                            <span>{translation.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </div>

            <div 
                id="kodik-player"
                className="w-full aspect-video rounded-[14px] h-[500px] sm:h-[500px] lg:h-[700px] overflow-hidden bg-white/5"
            />
        </div>
    );
};

export default VideoPlayer;
