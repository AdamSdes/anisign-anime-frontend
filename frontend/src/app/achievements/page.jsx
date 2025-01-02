'use client';
import { Trophy, Eye, Clock, Star, Target, Award } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import React from "react";
import Footer from "@/widgets/Footer/Footer";

const achievementCategories = [
  {
    id: 'viewing',
    name: 'Просмотр',
    icon: Eye,
    achievements: [
      {
        title: "Первый шаг",
        description: "Посмотрите первое аниме",
        icon: Eye,
        progress: 100,
        isCompleted: true
      },
      {
        title: "Начинающий зритель",
        description: "Посмотрите 10 аниме",
        icon: Eye,
        progress: 60,
        isCompleted: false,
        current: 6,
        total: 10
      },
      {
        title: "Опытный зритель",
        description: "Посмотрите 50 аниме",
        icon: Eye,
        progress: 20,
        isCompleted: false,
        current: 10,
        total: 50
      },
      {
        title: "Анимешник",
        description: "Посмотрите 100 аниме",
        icon: Eye,
        progress: 5,
        isCompleted: false,
        current: 5,
        total: 100
      }
    ]
  },
  {
    id: 'time',
    name: 'Время',
    icon: Clock,
    achievements: [
      {
        title: "Первый час",
        description: "Проведите на сайте 1 час",
        icon: Clock,
        progress: 100,
        isCompleted: true
      },
      {
        title: "День с нами",
        description: "Проведите на сайте 24 часа",
        icon: Clock,
        progress: 45,
        isCompleted: false,
        current: 11,
        total: 24
      }
    ]
  },
  // Add more categories as needed
];

const AchievementCard = ({ title, description, icon: Icon, progress, isCompleted, current, total, index }) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        group relative p-6 rounded-[20px] border overflow-hidden
        ${isCompleted 
          ? 'bg-gradient-to-br from-[#CCBAE4]/10 to-[#CCBAE4]/5 border-[#CCBAE4]/20 hover:border-[#CCBAE4]/40' 
          : 'bg-[rgba(255,255,255,0.02)] border-white/5 hover:border-white/10'}
        transition-all duration-300 
      `}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, 
            ${isCompleted ? 'rgba(204, 186, 228, 0.06)' : 'rgba(255, 255, 255, 0.06)'}, 
            transparent 40%)`,
        }}
      />

      {/* Существующий контент */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Иконка и статус */}
        <div className="flex items-start justify-between">
          <div className={`
            p-3 rounded-2xl
            ${isCompleted 
              ? 'bg-[#CCBAE4]/20 group-hover:bg-[#CCBAE4]/30' 
              : 'bg-white/5 group-hover:bg-white/10'}
            transition-all duration-300
          `}>
            <Icon className={`
              h-6 w-6
              ${isCompleted 
                ? 'text-[#CCBAE4] group-hover:scale-110' 
                : 'text-white/60 group-hover:text-white/80'}
              transition-all duration-300
            `} />
          </div>
          {isCompleted && (
            <div className="animate-pulse">
              <Trophy className="h-6 w-6 text-[#CCBAE4]" />
            </div>
          )}
        </div>
        
        {/* Заголовок и описание */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-white/60 line-clamp-2">{description}</p>
        </div>

        {/* Прогресс */}
        <div className="space-y-2">
          {!isCompleted && current && total && (
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Прогресс</span>
              <span className="font-medium text-[#CCBAE4]">{current}/{total}</span>
            </div>
          )}
          <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`
                absolute left-0 top-0 h-full rounded-full
                ${isCompleted 
                  ? 'bg-gradient-to-r from-[#CCBAE4] to-[#CCBAE4]/80' 
                  : 'bg-white/20'}
                transition-all duration-1000 ease-out
              `}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AchievementProgress = () => {
  const totalAchievements = 24;
  const completedAchievements = 8;
  const progress = (completedAchievements / totalAchievements) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#CCBAE4]/10 via-black/20 to-transparent border border-white/10 p-6"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCBAE4]/5 blur-3xl rounded-full -translate-y-32 translate-x-32" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Уровень достижений</h2>
            <p className="text-white/60">Разблокируйте новые достижения</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#CCBAE4]">{completedAchievements}/{totalAchievements}</p>
            <p className="text-white/40 text-sm">достижений получено</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#CCBAE4] to-[#CCBAE4]/60 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            { [
              { label: 'Текущий статус', value: 'Новичок', color: 'text-[#CCBAE4]' },
              { label: 'Следующий статус', value: 'Местный', color: 'text-white/60' },
              { label: 'Нужно опыта', value: '350 XP', color: 'text-white/60' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/[0.02] rounded-2xl p-4">
                <p className="text-sm text-white/40 mb-1">{stat.label}</p>
                <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AchievementsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <Header/>
      <Report/>
      <div className="container mx-auto max-w-[1400px] px-4 py-10">
        <AchievementProgress />
        
        <motion.div 
          className="mt-10 space-y-8"
          variants={containerVariants}
        >
          {achievementCategories.map((category) => (
            <motion.section 
              key={category.id}
              variants={sectionVariants}
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="p-3 rounded-xl bg-white/[0.02]">
                  <category.icon className="w-5 h-5 text-[#CCBAE4]" />
                </div>
                <h2 className="text-xl font-semibold">{category.name}</h2>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.achievements.map((achievement, index) => (
                  <AchievementCard 
                    key={index}
                    {...achievement}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>
      </div>
      <Footer/>
    </motion.div>

  );
}
