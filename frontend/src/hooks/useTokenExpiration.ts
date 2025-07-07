import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '@/services/authService';

interface DecodedToken {
  exp: number;
  sub: string;
  [key: string]: string | number | boolean | null;
}

/**
 * Хук для отслеживания времени до истечения JWT токена
 * @returns Объект с информацией о времени истечения токена
 */
export const useTokenExpiration = () => {
  const [expiresIn, setExpiresIn] = useState<{
    minutes: number;
    seconds: number;
    expired: boolean;
    timestamp: number | null;
  }>({
    minutes: 0,
    seconds: 0,
    expired: false,
    timestamp: null,
  });

  useEffect(() => {
    // Функция для обновления времени
    const updateRemainingTime = () => {
      const token = authService.getAccessToken();
      
      if (!token) {
        setExpiresIn({
          minutes: 0,
          seconds: 0,
          expired: true,
          timestamp: null,
        });
        return;
      }
      
      try {
        // Декодируем токен
        const decoded = jwtDecode<DecodedToken>(token);
        const expTimestamp = decoded.exp;
        
        // Вычисляем оставшееся время в секундах
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = expTimestamp - now;
        
        if (timeLeft <= 0) {
          setExpiresIn({
            minutes: 0,
            seconds: 0,
            expired: true,
            timestamp: expTimestamp,
          });
        } else {
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          
          setExpiresIn({
            minutes,
            seconds,
            expired: false,
            timestamp: expTimestamp,
          });
        }
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        setExpiresIn({
          minutes: 0,
          seconds: 0,
          expired: true,
          timestamp: null,
        });
      }
    };

    // Сразу обновляем время при монтировании
    updateRemainingTime();

    // Обновляем каждую секунду
    const interval = setInterval(updateRemainingTime, 1000);

    // Очищаем интервал при размонтировании
    return () => clearInterval(interval);
  }, []);

  return expiresIn;
};
