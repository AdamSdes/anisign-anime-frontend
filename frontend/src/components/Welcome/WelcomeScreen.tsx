'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Users2, Sparkles, Crown, PlayCircle, BookMarked } from "lucide-react";
import { motion } from "framer-motion";

const WelcomeScreen = () => {
    const router = useRouter();

    const features = [
        {
            icon: Sparkles,
            title: "Современный дизайн",
            description: "Удобный и интуитивно понятный интерфейс для комфортного просмотра",
            color: "#CCBAE4"
        },
        {
            icon: Crown,
            title: "Pro возможности",
            description: "Расширенный функционал для истинных ценителей аниме",
            color: "#86EFAC"
        },
        {
            icon: Users2,
            title: "Сообщество",
            description: "Общайтесь с единомышленниками и делитесь впечатлениями",
            color: "#93C5FD"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#060606]">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/background/back2.png')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/50 via-[#060606] to-[#060606]" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 py-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto"
                >
                    {/* Hero Section */}
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white/90 to-white/50 bg-clip-text text-transparent">
                            Добро пожаловать на AniSign
                        </h1>
                        <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
                            Погрузитесь в мир аниме с удобной платформой для просмотра и управления вашей коллекцией
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button 
                                onClick={() => router.push('/auth')}
                                className="h-[58px] px-8 bg-[#DEDEDF] hover:bg-[#DEDEDF]/90 text-black font-medium rounded-xl"
                            >
                                Начать пользоваться
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button 
                                variant="ghost"
                                onClick={() => router.push('/anime-list')}
                                className="h-[58px] px-8 bg-white/[0.02] hover:bg-white/[0.04] text-white border border-white/5 rounded-xl"
                            >
                                Смотреть аниме
                                <PlayCircle className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-16">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="p-3 w-fit rounded-xl" style={{ backgroundColor: `${feature.color}10` }}>
                                        <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white/90">{feature.title}</h3>
                                    <p className="text-white/60">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center"
                    >
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-3xl font-bold text-white/90 mb-2">1000+</h4>
                                <p className="text-white/60">Аниме в базе</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white/90 mb-2">50K+</h4>
                                <p className="text-white/60">Активных пользователей</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white/90 mb-2">24/7</h4>
                                <p className="text-white/60">Техподдержка</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default WelcomeScreen;