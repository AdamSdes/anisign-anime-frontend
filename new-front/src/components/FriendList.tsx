import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button/Button';

type TranslationFunction = ReturnType<typeof useTranslations>;

interface Friend {
    id: number;
    username: string;
    avatar: string | null;
}
interface FriendListProps {
    friends: Friend[];
}

/**
 * Компонент списка друзей
 * @param friends Список друзей
 */
const FriendList = ({ friends }: FriendListProps) => {
    const t = useTranslations('common') as TranslationFunction;
    const [friendList, setFriendList] = useState<Friend[]>(friends);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Мок-запрос, TODO: Заменить на реальный АПИ
        setTimeout(() => {
            setFriendList([
                { id: 1, username: 'Friend1', avatar: '#' },
                { id: 2, username: 'Friend2', avatar: '#' },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);
    if (isLoading) {
        return (
            <div className="friend-list background-placeholder">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="friend-card">
                        <div className="animate-pulse sceleton h-12 bg-gray-700 rounded mb-2"></div>
                        <div className="animate-pulse skeleton h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="friend-list background-placeholder">
            <h2 className="text-2xl font-bold mb-4">{t('friends')}</h2>
            {friendList.length === 0 ? (
                <p className="text-gray-400">{t('noFriends')}</p>
            ) : (
                friendList.map((friend) => (
                    <div key={friend.id} className="friend-card">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={friend.avatar || '#'} 
                                alt={`${friend.username}'s avatar`}
                                className="friendavatar"
                                loading="lazy" 
                            />
                            <p className="friend-username">{friend.username}</p>
                        </div>
                        <Button
                            variant="secondary"
                            className="profile-edit-button mt-2"
                        >
                            {t('removeFriend')}
                        </Button>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendList;