import { User } from '@/shared/types/user';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

type TranslationFunction = ReturnType<typeof useTranslations>;

interface UserProfileProps {
    user: User;
    onUpdateNickname: (newNickname: string) => void;
}

/**
 * Компонент профиля пользователя + редактирование ника
 * @param user Данные ользователя
 * @param onUpdateNickname Обновить никнейм пользователя
 */
const UserProfile = ({ user, onUpdateNickname }: UserProfileProps) => {
    const t  = useTranslations('common') as TranslationFunction;
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(user.username);
    const [avatarUrl, setAvatarUrl] = useState(user.avatar);
    const handleSaveNickname = () => {
        onUpdateNickname(nickname);
        setIsEditing(false);
    };
    const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            // TODO: Заменить АПИ
            fetch('/api/user/update-my-avatar', {
                method: 'PUT',
                headers: { 'username': user.username },
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    setAvatarUrl(data.avatar || user.avatar);
                })
                .catch((error) => console.error('Аватар не загружен:', error));   
        }
    };
    return (
        <div className="profile background-placeholder">
            <div className="relative">
                <img 
                    src={avatarUrl || '#'} 
                    alt={`${user.username}'s avatar`}
                    className="profile-avatar animate-pulse skeleton"
                    onLoad={(e) => e.currentTarget.className = 'profile-avatar skeleton-loaded'} 
                />
                <input 
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                />
            </div>
            <div className="flex-1">
                {isEditing ? (
                    <div className="space-y-2">
                        <input 
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder={t('nickname')}
                            className="profile-nickname-input" 
                        />
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                onClick={handleSaveNickname}
                                className="profile-save-button"
                            >
                                {t('save')}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setNickname(user.username);
                                    setIsEditing(false);
                                }}
                                className="profile-cencel-button"
                            >
                                {t('cancel')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="profile-nickname">
                        <h1 className="profile-nickname-text">{user.username}</h1>
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditing(true)}
                            className="profile-edit-button"
                        >
                            {t('edit')}
                        </Button>
                    </div>
                )}
            </div>
            <div className="profile-stats">
                <div className="profile-stat-label">{t('watching')}</div>
                <div className="profile-stat-value">0</div>
                <div className="profile-stat-label">{t('completed')}</div>
                <div className="profile-stat-value">0</div>
                <div className="profile-stat-label">{t('planned')}</div>
                <div className="profile-stat-value">0</div>
                <div className="profile-stat-label">{t('dropped')}</div>
                <div className="profile-stat-value">0</div>
            </div>
        </div>
    );
};

export default UserProfile;