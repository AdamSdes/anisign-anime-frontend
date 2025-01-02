'use client';
import { Button } from "@/components/ui/button";
import { Crown, Check, X, Star, Shield, Zap, Gift, Sparkles, Film, Users } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import React from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ProPage() {
    return (
        <>
            <Header/>
            <Report/>
            <motion.main 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="min-h-screen py-20 relative overflow-hidden"
            >
                {/* Фоновые элементы */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#CCBAE4]/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#CCBAE4]/5 rounded-full blur-[150px]" />
                </div>

                <div className="container px-4 mx-auto relative z-10">
                    {/* Шапка */}
                    <motion.div 
                        variants={itemVariants}
                        className="text-center mb-20"
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#CCBAE4]/20 to-[#CCBAE4]/10 backdrop-blur-sm mb-6"
                        >
                            <Crown className="w-5 h-5 text-[#CCBAE4]" />
                            <span className="text-sm font-medium bg-gradient-to-r from-[#CCBAE4] to-white bg-clip-text text-transparent">
                                Премиум подписка
                            </span>
                        </motion.div>
                        <motion.h1 
                            variants={itemVariants}
                            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                        >
                            Разблокируйте все возможности
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg text-white/60 max-w-2xl mx-auto">
                            Наслаждайтесь аниме без ограничений и рекламы
                        </motion.p>
                    </motion.div>

                    {/* Преимущества */}
                    <motion.div 
                        variants={containerVariants}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                    >
                        <FeatureCard 
                            icon={Star}
                            title="Эксклюзивный контент"
                            description="Получите ранний доступ к новым сериям и специальным материалам"
                            gradient="from-yellow-500/20 to-orange-500/20"
                            iconColor="text-yellow-500"
                        />
                        <FeatureCard 
                            icon={Shield}
                            title="Без рекламы"
                            description="Смотрите любимые аниме без прерываний на рекламу"
                            gradient="from-green-500/20 to-emerald-500/20"
                            iconColor="text-green-500"
                        />
                        <FeatureCard 
                            icon={Film}
                            title="4K качество"
                            description="Максимальное качество видео и быстрая загрузка"
                            gradient="from-blue-500/20 to-cyan-500/20"
                            iconColor="text-blue-500"
                        />
                        <FeatureCard 
                            icon={Users}
                            title="Фан-клуб"
                            description="Эксклюзивный доступ к сообществу и чатам"
                            gradient="from-purple-500/20 to-pink-500/20"
                            iconColor="text-purple-500"
                        />
                        <FeatureCard 
                            icon={Sparkles}
                            title="Уникальный бейдж"
                            description="Выделяйтесь среди других пользователей"
                            gradient="from-[#CCBAE4]/20 to-white/20"
                            iconColor="text-[#CCBAE4]"
                        />
                        <FeatureCard 
                            icon={Zap}
                            title="Быстрая поддержка"
                            description="Приоритетная поддержка 24/7"
                            gradient="from-orange-500/20 to-red-500/20"
                            iconColor="text-orange-500"
                        />
                    </motion.div>

                    {/* Карточка подписки */}
                    <motion.div 
                        variants={itemVariants}
                        className="max-w-lg mx-auto"
                    >
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="relative"
                        >
                            <div className="absolute z-10 -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#CCBAE4] to-[#CCBAE4]/80 rounded-full text-black text-sm font-medium">
                                Специальное предложение
                            </div>
                            <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                                <div className="text-center mb-8">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-5xl font-bold">$4</span>
                                        <span className="text-lg text-white/60">/месяц</span>
                                    </div>
                                    <p className="text-sm text-white/40 mt-2">Отменить можно в любой момент</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <Feature text="Все эпизоды в HD качестве" />
                                    <Feature text="Эксклюзивные материалы" />
                                    <Feature text="Без рекламы" />
                                    <Feature text="Загрузка серий" />
                                    <Feature text="Поддержка 24/7" />
                                </div>

                                <Button 
                                    className="w-full h-12 bg-gradient-to-r from-[#CCBAE4] to-[#CCBAE4]/80 hover:opacity-90 text-black rounded-xl font-medium transition-opacity"
                                >
                                    Активировать Premium
                                </Button>

                                <p className="text-center text-xs text-white/40 mt-4">
                                    Подписываясь, вы принимаете условия использования
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Статистика */}
                    <motion.div 
                        variants={itemVariants}
                        className="mt-20 text-center space-y-2"
                    >
                        <p className="text-2xl font-bold">
                            <span className="text-[#CCBAE4]">10,000+</span> пользователей выбрали Premium
                        </p>
                        <p className="text-white/40">
                            Присоединяйтесь к сообществу любителей аниме
                        </p>
                    </motion.div>
                </div>
            </motion.main>
        </>
    );
}

const FeatureCard = ({ icon: Icon, title, description, gradient, iconColor }) => (
    <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-gradient-to-br ${gradient} p-[1px] rounded-2xl group transition-transform`}
    >
        <div className="h-full bg-[#060606] rounded-2xl p-6">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${iconColor}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-white/60">{description}</p>
        </div>
    </motion.div>
);

const Feature = ({ text }) => (
    <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3"
    >
        <motion.div 
            whileHover={{ scale: 1.2 }}
            className="w-5 h-5 rounded-full bg-[#CCBAE4]/10 flex items-center justify-center"
        >
            <Check className="w-3 h-3 text-[#CCBAE4]" />
        </motion.div>
        <span className="text-sm text-white/80">{text}</span>
    </motion.div>
);
