'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChangePasswordDialog } from "@/components/ui/change-password-dialog";
import { Badge } from "@/components/ui/badge";
import { 
    Bell, Shield, User, Eye, Moon, Volume2, Settings2,
    Palette, MonitorSmartphone, Globe, Mail, ChevronRight,
    PlayCircle, Layout, MessageCircle, Language, Timer,
    BellRing, Video, Headphones, Filter, Sliders, Heart
} from "lucide-react";
import { toast } from "sonner";

const SettingsSection = ({ icon: Icon, title, description, children }) => (
    <div className="p-8 rounded-[24px] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl">
        <div className="flex items-start gap-5 mb-8">
            <div className="p-3.5 rounded-2xl bg-[#CCBAE4]/10 backdrop-blur-xl">
                <Icon className="h-6 w-6 text-[#CCBAE4]" />
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-1">{title}</h2>
                {description && <p className="text-sm text-white/60">{description}</p>}
            </div>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const SettingItem = ({ label, description, children }) => (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
        <div>
            <p className="font-medium text-[15px] text-white/90">{label}</p>
            {description && <p className="text-sm text-white/50 mt-0.5">{description}</p>}
        </div>
        {children}
    </div>
);

const SettingsSidebar = ({ activeSection, onSectionChange }) => {
    const sections = [
        { id: 'overview', icon: Layout, label: 'Обзор' },
        { id: 'profile', icon: User, label: 'Профиль' },
        { id: 'appearance', icon: Palette, label: 'Внешний вид' },
        { id: 'notifications', icon: BellRing, label: 'Уведомления' },
        { id: 'player', icon: Video, label: 'Плеер' },
    ];

    return (
        <div className="w-[280px] gap-3 flex-shrink-0 border-r border-white/5">
            <div className="p-4">
                {sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => onSectionChange(section.id)}
                        className={`
                            w-full flex items-center gap-3 p-3 rounded-xl text-[15px] font-medium
                            transition-all duration-300
                            ${activeSection === section.id 
                                ? 'bg-[#CCBAE4]/10 text-[#CCBAE4]' 
                                : 'text-white/60 hover:bg-white/5 hover:text-white'}
                        `}
                    >
                        <section.icon className="h-5 w-5" />
                        {section.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, change }) => (
    <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5">
        <div className="flex items-start justify-between">
            <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-[#CCBAE4]/10 w-fit">
                    <Icon className="h-5 w-5 text-[#CCBAE4]" />
                </div>
                <div>
                    <p className="text-sm text-white/60">{label}</p>
                    <p className="text-2xl font-semibold mt-1">{value}</p>
                </div>
            </div>
            {change && (
                <span className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change > 0 ? '+' : ''}{change}%
                </span>
            )}
        </div>
    </div>
);

const Settings = () => {
    const [activeSection, setActiveSection] = React.useState('overview');
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);
    const [selectedTheme, setSelectedTheme] = React.useState('dark');
    const [selectedQuality, setSelectedQuality] = React.useState('1080p');

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <StatCard 
                                icon={Timer} 
                                label="Время на сайте" 
                                value="142ч" 
                                change={12} 
                            />
                            <StatCard 
                                icon={Eye} 
                                label="Просмотрено" 
                                value="86 аниме" 
                                change={5} 
                            />
                            <StatCard 
                                icon={Heart} 
                                label="В избранном" 
                                value="24" 
                                change={-2} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Быстрые настройки */}
                            <SettingsSection 
                                icon={Sliders} 
                                title="Быстрые настройки"
                                description="Часто используемые настройки"
                            >
                                <SettingItem 
                                    label="Тёмная тема" 
                                    description="Включить тёмное оформление"
                                >
                                    <Switch defaultChecked />
                                </SettingItem>
                                <SettingItem 
                                    label="Уведомления" 
                                    description="Push-уведомления в браузере"
                                >
                                    <Switch />
                                </SettingItem>
                            </SettingsSection>

                            {/* Последняя активность */}
                            <SettingsSection 
                                icon={Timer} 
                                title="Последняя активность"
                                description="Ваши недавние действия"
                            >
                                {['Изменены настройки профиля', 'Добавлено аниме в избранное', 'Изменен пароль'].map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                        <span className="text-sm text-white/60">{activity}</span>
                                        <ChevronRight className="h-4 w-4 text-white/40" />
                                    </div>
                                ))}
                            </SettingsSection>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <SettingsSection 
                        icon={User} 
                        title="Профиль" 
                        description="Управление учетной записью"
                    >
                        <SettingItem 
                            label="Email" 
                            description="Ваш основной email адрес"
                        >
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-white/40" />
                                <span className="text-white/60">user@example.com</span>
                            </div>
                        </SettingItem>
                        <SettingItem 
                            label="Безопасность" 
                            description="Изменить пароль учетной записи"
                        >
                            <Button 
                                onClick={() => setIsPasswordDialogOpen(true)}
                                className="px-4 h-9 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg"
                            >
                                Изменить
                            </Button>
                        </SettingItem>
                    </SettingsSection>
                );
            case 'appearance':
                return (
                    <SettingsSection 
                        icon={Palette} 
                        title="Персонализация" 
                        description="Настройте внешний вид приложения"
                    >
                        <SettingItem 
                            label="Тема оформления" 
                            description="Выберите тему интерфейса"
                        >
                            <div className="flex gap-2">
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className={`bg-black ${selectedTheme === 'dark' ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setSelectedTheme('dark')}
                                >
                                    Тёмная
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className={`bg-white/80 text-black ${selectedTheme === 'light' ? 'border-black' : 'border-transparent'}`}
                                    onClick={() => setSelectedTheme('light')}
                                >
                                    Светлая
                                </Button>
                            </div>
                        </SettingItem>
                        <SettingItem 
                            label="Акцентный цвет" 
                            description="Основной цвет интерфейса"
                        >
                            <div className="flex gap-2">
                                {['#CCBAE4', '#BFF6F9', '#F3CB80'].map(color => (
                                    <button 
                                        key={color}
                                        className="w-6 h-6 rounded-full border-2 border-white/20"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </SettingItem>
                    </SettingsSection>
                );
            case 'notifications':
                return (
                    <SettingsSection 
                        icon={BellRing} 
                        title="Уведомления" 
                        description="Настройка оповещений"
                    >
                        <SettingItem 
                            label="Push-уведомления" 
                            description="Мгновенные оповещения в браузере"
                        >
                            <Switch />
                        </SettingItem>
                        <SettingItem 
                            label="Новые серии" 
                            description="Уведомления о выходе новых серий"
                        >
                            <Switch />
                        </SettingItem>
                        <SettingItem 
                            label="Системные уведомления" 
                            description="Важные обновления системы"
                        >
                            <Switch />
                        </SettingItem>
                    </SettingsSection>
                );
            case 'player':
                return (
                    <SettingsSection 
                        icon={Video} 
                        title="Плеер" 
                        description="Настройки воспроизведения"
                    >
                        <SettingItem 
                            label="Автовоспроизведение" 
                            description="Автоматически начинать следующую серию"
                        >
                            <Switch />
                        </SettingItem>
                        <SettingItem 
                            label="Качество видео по умолчанию"
                        >
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {['720p', '1080p', 'AUTO'].map(quality => (
                                    <Button 
                                        key={quality}
                                        variant="outline" 
                                        className={`bg-white/5 hover:bg-white/10 ${selectedQuality === quality ? 'border-white' : 'border-transparent'}`}
                                        onClick={() => setSelectedQuality(quality)}
                                    >
                                        {quality}
                                    </Button>
                                ))}
                            </div>
                        </SettingItem>
                    </SettingsSection>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-2 py-10">
            <div className="">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl font-bold">Настройки</h1>
                        <p className="text-white/60 text-sm mt-1">Управление аккаунтом и настройками</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex gap-8">
                    <SettingsSidebar 
                        activeSection={activeSection} 
                        onSectionChange={setActiveSection} 
                    />
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>
            </div>

            <ChangePasswordDialog 
                isOpen={isPasswordDialogOpen}
                onClose={() => setIsPasswordDialogOpen(false)}
                onChangePassword={() => {}}
            />
        </div>
    );
};

export default Settings;
