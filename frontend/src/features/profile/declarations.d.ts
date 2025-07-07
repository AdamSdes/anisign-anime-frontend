// Объявление типов для компонентов профиля

// ProfileBanner
declare module './ProfileBanner' {
  interface ProfileBannerProps {
    user_banner?: string;
    isOwnProfile: boolean;
    isLoading?: boolean;
    onBannerUpdate?: () => void;
  }
  
  const ProfileBanner: React.FC<ProfileBannerProps>;
  export default ProfileBanner;
}

// ProfileAvatar
declare module './ProfileAvatar' {
  interface ProfileAvatarProps {
    username: string;
    avatar?: string;
    nickname?: string;
    isOwnProfile: boolean;
    isLoading?: boolean;
    onAvatarUpdate?: () => void;
  }
  
  const ProfileAvatar: React.FC<ProfileAvatarProps>;
  export default ProfileAvatar;
}

// ProfileInfo
declare module './ProfileInfo' {
  interface ProfileInfoProps {
    username: string;
    nickname?: string;
    isOwnProfile: boolean;
    isLoading?: boolean;
  }
  
  const ProfileInfo: React.FC<ProfileInfoProps>;
  export default ProfileInfo;
}

// ProfileActions
declare module './ProfileActions' {
  interface ProfileActionsProps {
    username: string;
    isOwnProfile: boolean;
  }
  
  const ProfileActions: React.FC<ProfileActionsProps>;
  export default ProfileActions;
}
