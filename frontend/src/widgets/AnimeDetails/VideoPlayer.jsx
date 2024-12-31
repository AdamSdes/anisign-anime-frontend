'use client';
import React, { useEffect, useState } from 'react';

const VideoPlayer = ({ shikimoriId }) => {
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!shikimoriId) {
            console.log('Нет shikimoriId:', shikimoriId);
            return;
        }

        console.log('Используем shikimoriId:', shikimoriId);

        // Очищаем предыдущий плеер если он есть
        const existingPlayer = document.getElementById('kodik-player');
        if (existingPlayer) {
            existingPlayer.innerHTML = '';
            setError(false);
        }

        // Создаем iframe напрямую
        const iframe = document.createElement('iframe');
        iframe.src = `//kodik.info/find-player?shikimoriID=${shikimoriId}&only_season=false&only_episode=false`;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.allow = 'autoplay *; fullscreen *';

        // Добавляем обработчик ошибок
        iframe.onerror = () => {
            setError(true);
            console.error('Ошибка загрузки плеера');
        };

        // Добавляем iframe в контейнер
        const container = document.getElementById('kodik-player');
        if (container) {
            container.appendChild(iframe);
        }

        // Очистка при размонтировании
        return () => {
            if (container && iframe) {
                container.removeChild(iframe);
            }
        };
    }, [shikimoriId]);

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
        <div 
            id="kodik-player"
            className="w-full aspect-video rounded-[14px] overflow-hidden bg-gray-900 flex items-center justify-center"
        >
            <div className="animate-pulse text-white/60">
                Загрузка плеера...
            </div>
        </div>
    );
};

export default VideoPlayer;
