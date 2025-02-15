'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Palette, Bell, Shield, Eye } from 'lucide-react';
import { SettingsHeader } from '@/components/Settings/SettingsHeader';
import { SettingsSidebar } from '@/components/Settings/SettingsSidebar';
import { ProfileSettings } from '@/components/Settings/ProfileSettings';
import { AppearanceSettings } from '@/components/Settings/AppearanceSettings';
import { NotificationSettings } from '@/components/Settings/NotificationSettings';
import { SecuritySettings } from '@/components/Settings/SecuritySettings';
import { PrivacySettings } from '@/components/Settings/PrivacySettings';

const sections = [
  { id: 'profile', label: 'Профиль', icon: User },
  { id: 'appearance', label: 'Внешний вид', icon: Palette },
  { id: 'notifications', label: 'Уведомления', icon: Bell },
  { id: 'security', label: 'Безопасность', icon: Shield },
  { id: 'privacy', label: 'Приватность', icon: Eye },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'privacy':
        return <PrivacySettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#060606]">
      <SettingsHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5">
              <Settings className="h-5 w-5 text-white/60" />
            </div>
            <h1 className="text-[24px] font-bold text-white/90">Настройки</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
            <SettingsSidebar
              sections={sections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
