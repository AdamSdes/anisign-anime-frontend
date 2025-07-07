'use client';

import React from 'react';
import { FileUploadDialog } from '@/components/ui/file-upload-dialog';
import { toast } from 'sonner';
import userService from '@/services/userService';
import ProfileBanner from '@/features/profile/ProfileBanner';
import ProfileAvatar from '@/features/profile/ProfileAvatar';
import { ProfileInfo } from '@/features/profile/ProfileInfo';
import ProfileActions from '@/features/profile/ProfileActions';
import { useAuth } from '@/context/AuthContext';

/**
 * Интерфейс пропсов компонента ProfileHeader
 * @interface ProfileHeaderProps
 */
interface ProfileHeaderProps {
  username: string;
  avatar?: string;
  user_banner?: string;
  nickname?: string;
  isOwnProfile: boolean;
  isLoading: boolean;
  refetchUser: () => Promise<unknown>;
}

/**
 * Компонент заголовка профиля
 * @description Отображает баннер, аватар, информацию и действия пользователя
 * @param {ProfileHeaderProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(
  ({ username, avatar, user_banner, nickname, isOwnProfile, isLoading, refetchUser }) => {
    const [isUploadBannerDialogOpen, setIsUploadBannerDialogOpen] = React.useState(false);
    const [isUploadAvatarDialogOpen, setIsUploadAvatarDialogOpen] = React.useState(false);
    const { refreshBannerTimestamp, refreshAvatarTimestamp } = useAuth();

    // Логирование для отладки
    console.log('ProfileHeader props:', { username, avatar, user_banner, nickname, isOwnProfile });

    const handleUploadBanner = async (files: File[]) => {
      if (files.length > 0) {
        try {
          console.log('Начинаем загрузку баннера:', files[0].name);
          // Используем метод из userService для загрузки баннера
          const response = await userService.updateBanner(files[0]);
          console.log('Ответ от API при загрузке баннера:', response);
          toast.success('Баннер успешно загружен');

          // Сначала обновляем данные пользователя, чтобы получить новый URL баннера
          if (refetchUser) {
            console.log('Обновляем данные пользователя после загрузки баннера');
            await refetchUser();
          }

          // Затем обновляем метку времени для принудительного обновления кеша
          // Это заставит ProfileBanner перезагрузить изображение с новым timestamp
          refreshBannerTimestamp();
        } catch (error) {
          console.error('Ошибка при загрузке баннера:', error);
          toast.error('Ошибка при загрузке баннера');
          setIsUploadBannerDialogOpen(false);
        }
      }
    };

    const handleUploadAvatar = async (files: File[]) => {
      if (files.length > 0) {
        try {
          console.log('Начинаем загрузку аватара:', files[0].name);
          // Используем метод из userService для загрузки аватара
          const response = await userService.updateAvatar(files[0]);
          console.log('Ответ от API при загрузке аватара:', response);
          toast.success('Аватар успешно загружен');

          // Сначала обновляем данные пользователя, чтобы получить новый URL аватара
          if (refetchUser) {
            console.log('Обновляем данные пользователя после загрузки аватара');
            await refetchUser();
          }

          // Затем обновляем метку времени для принудительного обновления кеша
          refreshAvatarTimestamp();
        } catch (error) {
          console.error('Ошибка при загрузке аватара:', error);
          toast.error('Ошибка при загрузке аватара');
          setIsUploadAvatarDialogOpen(false);
        }
      }
    };

    if (isLoading) return <div className='text-white/40'>Загрузка...</div>;

    return (
      <div className='relative'>
        {/* Баннер */}
        <div className='absolute inset-x-0 top-0 w-full h-[350px]'>
          <ProfileBanner
            user_banner={user_banner}
            username={username}
            isOwnProfile={isOwnProfile}
            isLoading={isLoading}
          />
        </div>

        {/* Основной контент */}
        <div className='container mx-auto px-4 sm:px-8 pb-4 max-w-[1450px] relative pt-[200px]'>
          <div className='flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-end'>
            <div className='relative flex flex-col items-center justify-center w-[185px] h-[247px] gap-3 rounded-[14px] border border-white/5 overflow-hidden'>
              <ProfileAvatar
                username={username}
                avatar={avatar}
                nickname={nickname}
                isOwnProfile={isOwnProfile}
                isLoading={isLoading}
                onUploadClick={() => setIsUploadAvatarDialogOpen(true)}
              />
            </div>
            <div className='flex-1 flex flex-col sm:flex-row gap-4 items-center sm:items-end sm:justify-between w-full'>
              <ProfileInfo
                username={username}
                nickname={nickname}
                isLoading={isLoading}
                isOwnProfile={isOwnProfile}
                onChangeBannerClick={() => setIsUploadBannerDialogOpen(true)}
              />
              {isOwnProfile && <ProfileActions isOwnProfile={true} />}
            </div>
          </div>
        </div>

        {/* Диалог загрузки баннера */}
        <FileUploadDialog
          isOpen={isUploadBannerDialogOpen}
          onClose={() => setIsUploadBannerDialogOpen(false)}
          onUpload={handleUploadBanner}
          acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
          maxFiles={1}
          maxSize={5 * 1024 * 1024} // 5MB
          title='Загрузка баннера'
          description='Выберите изображение для баннера профиля'
        />

        {/* Диалог загрузки аватара */}
        <FileUploadDialog
          isOpen={isUploadAvatarDialogOpen}
          onClose={() => setIsUploadAvatarDialogOpen(false)}
          onUpload={handleUploadAvatar}
          acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
          maxFiles={1}
          maxSize={2 * 1024 * 1024} // 2MB
          title='Загрузка аватара'
          description='Выберите изображение для аватара профиля'
        />
      </div>
    );
  }
);

ProfileHeader.displayName = 'ProfileHeader';
export default ProfileHeader;
