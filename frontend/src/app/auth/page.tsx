"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { Mail, Lock, ArrowLeft, User, Check, Volume2, VolumeX, Plus } from "lucide-react";
import { GoogleIcon, DiscordIcon } from "@/components/icons/icons";
import { useLogin, useRegister } from "@/hooks/hookUser";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { loginSchema, registerSchema } from "@/lib/validation/authVal";
import { z } from "zod";
import { axiosInstance } from "@/lib/axios/axiosConfig";

// Атом для состояния аутентификации
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; token?: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
  hydrated?: boolean;
}>({
  isAuthenticated: false,
  user: null,
  hydrated: false,
});

/**
 * Интерфейс данных OAuth URL
 * @interface OAuthUrls
 */
interface OAuthUrls {
  google?: string;
  discord?: string;
}

/**
 * Пропсы компонента Auth
 * @interface AuthProps
 */
interface AuthProps {}

// Варианты анимации для социальных кнопок
const socialButtonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

// Варианты анимации для формы
const formVariants = {
  enter: (isLogin: boolean) => ({
    x: isLogin ? -20 : 20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (isLogin: boolean) => ({
    x: isLogin ? 20 : -20,
    opacity: 0,
  }),
};

// Варианты анимации для полей ввода
const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

// Варианты анимации для полей формы
const formFieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

/**
 * Компонент страницы авторизации/регистрации
 * @description Отображает форму входа, регистрации или восстановления пароля с фоновым видео
 * @returns {JSX.Element}
 */
const Auth: React.FC<AuthProps> = React.memo(() => {
  const router = useRouter();
  const [auth] = useAtom(authAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasAgreedToToS, setHasAgreedToToS] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(50);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // SWR для загрузки OAuth URL
  const { data: oauthUrls, error: oauthError } = useSWR<OAuthUrls>(
    "/api/auth/oauth-urls",
    (url) => axiosInstance.get(url).then((res: { data: any }) => res.data),
    { revalidateOnFocus: false }
  );

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  useEffect(() => {
    if (auth.hydrated && auth.isAuthenticated) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [auth.hydrated, auth.isAuthenticated, router]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "onReady") {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            JSON.stringify({
              event: "command",
              func: "mute",
              args: [],
            }),
            "*"
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = loginSchema.parse({
        username,
        password,
        remember_me: rememberMe,
      });
      await loginMutation.mutateAsync(validatedData);
      toast.success("Успешный вход!");
      router.push("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error((error as any).message || "Ошибка при входе");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedToToS) {
      toast.error("Необходимо принять условия использования");
      return;
    }
    if (!username || !password || !confirmPassword) {
      toast.error("Все поля обязательны для заполнения");
      return;
    }
    try {
      const validatedData = registerSchema.parse({
        username,
        password,
        confirmPassword,
      });
      const apiData = {
        username: validatedData.username,
        password: validatedData.password,
        confirm_password: validatedData.confirmPassword,
      };
      await registerMutation.mutateAsync(apiData, {
        onError: (error: any) => {
          const errorMessage = error.message;
          if (errorMessage === "User already exists") {
            toast.error("Пользователь с таким именем уже существует");
          } else if (errorMessage.includes("detail")) {
            try {
              const errorData = JSON.parse(errorMessage);
              toast.error(errorData.detail || "Произошла ошибка при регистрации");
            } catch {
              toast.error(errorMessage);
            }
          } else {
            toast.error(errorMessage);
          }
        },
        onSuccess: () => {
          toast.success("Регистрация успешна! Теперь вы можете войти.");
          setIsLogin(true);
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setHasAgreedToToS(false);
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("Ошибка при регистрации");
      }
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error("Введите email для восстановления пароля");
      return;
    }
    try {
      await axiosInstance.post("/api/auth/recover", { email: username });
      toast.success("Инструкции по восстановлению отправлены на ваш email");
      setIsRecovery(false);
      setUsername("");
    } catch (error) {
      toast.error((error as any).message || "Ошибка при восстановлении пароля");
    }
  };

  const toggleMute = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "unMute" : "mute",
          args: [],
        }),
        "*"
      );
      if (isMuted) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: "setVolume",
            args: [volume],
          }),
          "*"
        );
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow && !isMuted) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "setVolume",
          args: [newVolume],
        }),
        "*"
      );
    }
  };

  if (isLoading) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="relative overflow-hidden">
        {/* Фоновое видео */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <iframe
            ref={iframeRef}
            src="https://www.youtube.com/embed/W4B7C7bntr0?autoplay=1&controls=0&mute=1&loop=1&playlist=W4B7C7bntr0&playsinline=1&start=0&vq=hd1080&modestbranding=1&rel=0&enablejsapi=1&origin=http://localhost:3000"
            className="absolute w-[130%] h-[130%] -top-[20%] -left-[20%] pointer-events-none opacity-80"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white/70 hover:text-white/90"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Логотип в верхнем правом углу */}
        <div className="absolute top-4 left-4 z-30">
          <Link href="/">
            <img src="/icon/LogoAuth.png" alt="Anisign Logo" />
          </Link>
        </div>

        <div className="relative flex items-center justify-center md:justify-end w-full min-h-screen p-4 z-20">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#060606]/95 backdrop-blur-xl mx-auto md:mx-0 md:mr-[175px] p-6 md:p-[50px] rounded-[24px] w-full max-w-[490px] border border-white/5"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-8"
            >
              {/* Заголовок */}
              <motion.div variants={itemVariants} className="flex justify-between items-center w-full">
                <motion.p className="text-white/90 font-semibold">
                  {isRecovery ? "Восстановление пароля" : isLogin ? "Добро пожаловать ✌️" : ""}
                </motion.p>
                <Link
                  href="/"
                  className="h-[33px] w-[33px] rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center hover:bg-white/[0.04] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-white/60" />
                </Link>
              </motion.div>

              {/* Контент */}
              <AnimatePresence mode="wait">
                {isRecovery ? (
                  <motion.div
                    key="recovery"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col gap-8"
                  >
                    {/* Иконка восстановления */}
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                        <Mail className="w-7 h-7 text-[#CCBAE4]" />
                      </div>
                    </div>

                    {/* Описание восстановления */}
                    <div className="text-center space-y-2">
                      <h3 className="text-white/90 text-lg font-medium">Забыли пароль?</h3>
                      <p className="text-white/40 text-sm">
                        Введите email, указанный при регистрации. Мы отправим инструкции по восстановлению пароля.
                      </p>
                    </div>

                    {/* Форма восстановления */}
                    <form onSubmit={handleRecovery} className="space-y-4">
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="h-[58px] bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40 pl-12 focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20"
                        />
                        <Mail className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-[58px] bg-[#E4E4E4] hover:bg-[#DEDEDF]/90 text-black font-medium rounded-xl transition-colors"
                      >
                        Отправить инструкции
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsRecovery(false);
                          setUsername("");
                        }}
                        className="w-full text-[14px] text-white/60 hover:text-white/90 transition-colors"
                      >
                        Вернуться к входу
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="main-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col gap-8"
                  >
                    {/* Социальные кнопки */}
                    <div className="flex flex-col gap-8">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                        <motion.div
                          variants={socialButtonVariants}
                          initial="hidden"
                          animate="visible"
                          custom={0}
                          className="w-full"
                        >
                          <Button
                            variant="ghost"
                            onClick={() => oauthUrls?.google && window.location.assign(oauthUrls.google)}
                            className="w-full h-[58px] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl group transition-colors"
                          >
                            <GoogleIcon className="w-6 h-6 mr-2 transition-transform group-hover:scale-110 duration-300" />
                            <span className="text-white/80">Google</span>
                          </Button>
                        </motion.div>
                        <motion.div
                          variants={socialButtonVariants}
                          initial="hidden"
                          animate="visible"
                          custom={1}
                          className="w-full"
                        >
                          <Button
                            variant="ghost"
                            onClick={() => oauthUrls?.discord && window.location.assign(oauthUrls.discord)}
                            className="w-full h-[58px] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl group transition-colors"
                          >
                            <DiscordIcon className="w-6 h-6 mr-2 transition-transform group-hover:scale-110 duration-300" />
                            <span className="text-white/80">Discord</span>
                          </Button>
                        </motion.div>
                      </motion.div>

                      {/* Разделитель */}
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full h-[1px] bg-white/5" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Форма входа/регистрации */}
                    <AnimatePresence mode="wait" custom={isLogin}>
                      <motion.form
                        key={isLogin ? "login" : "register"}
                        custom={isLogin}
                        variants={formVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="flex flex-col gap-6"
                        onSubmit={isLogin ? handleLogin : handleRegister}
                      >
                        <div className="space-y-3">
                          <motion.div
                            custom={0}
                            variants={formFieldVariants}
                            initial="hidden"
                            animate="visible"
                            className="relative"
                          >
                            <Input
                              type="text"
                              placeholder="Логин"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="h-[58px] bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40 pl-12 [&:not(:placeholder-shown)]:text-white/90 focus:text-white/90 focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20"
                              style={{ colorScheme: "dark" }}
                            />
                            <User className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </motion.div>
                          <motion.div
                            custom={1}
                            variants={formFieldVariants}
                            initial="hidden"
                            animate="visible"
                            className="relative"
                          >
                            <Input
                              type="password"
                              placeholder="Пароль"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="h-[58px] bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40 pl-12 [&:not(:placeholder-shown)]:text-white/90 focus:text-white/90 focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20"
                              style={{ colorScheme: "dark" }}
                            />
                            <Lock className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </motion.div>
                          <AnimatePresence>
                            {!isLogin && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="relative"
                              >
                                <Input
                                  type="password"
                                  placeholder="Повторите Пароль"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className="h-[58px] bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40 pl-12 [&:not(:placeholder-shown)]:text-white/90 focus:text-white/90 focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20"
                                  style={{ colorScheme: "dark" }}
                                />
                                <Lock className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-6">
                          <motion.div
                            key={isLogin ? "login" : "register"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            {isLogin ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={() => setRememberMe(!rememberMe)}
                                    className="w-5 h-5 border-2 border-white/20 rounded-md data-[state=checked]:bg-[#CCBAE4] data-[state=checked]:border-[#CCBAE4] transition-colors"
                                  >
                                    <Check
                                      className={`h-3.5 w-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black pointer-events-none transition-opacity duration-200 ${rememberMe ? "opacity-100" : "opacity-0"}`}
                                    />
                                  </Checkbox>
                                  <Label
                                    htmlFor="remember"
                                    className="text-white/60 hover:text-white/80 transition-colors cursor-pointer select-none"
                                  >
                                    Запомнить меня
                                  </Label>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsRecovery(true)}
                                  className="text-sm text-[#CCBAE4] hover:text-[#CCBAE4]/80 transition-colors"
                                >
                                  Забыли пароль?
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="tos"
                                    checked={hasAgreedToToS}
                                    onCheckedChange={setHasAgreedToToS}
                                  />
                                  <Label
                                    htmlFor="tos"
                                    className="text-white/60 hover:text-white/80 transition-colors cursor-pointer select-none"
                                  >
                                    Согласен с{" "}
                                    <a href="#" className="text-[#CCBAE4] hover:text-[#CCBAE4]/80 transition-colors">
                                      правилами
                                    </a>{" "}
                                    сайта
                                  </Label>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            type="submit"
                            className="w-full h-[58px] bg-[#E4E4E4] hover:bg-[#DEDEDF]/90 text-black font-medium rounded-xl"
                          >
                            {isLogin ? "Войти" : "Создать"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsLogin(!isLogin)}
                            className="h-[58px] px-6 bg-white/[0.02] hover:bg-white/[0.04] text-white/90 hover:text-white/70 border border-white/5 rounded-xl flex items-center justify-center"
                          >
                            {!isLogin && (
                              <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <Plus className="w-5 h-5" />
                              </div>
                            )}
                            {isLogin && "Регистрация"}
                          </Button>
                        </div>
                      </motion.form>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Управление звуком */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 w-full flex flex-col gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-white/60 hover:text-white/90 transition-all duration-300"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={toggleMute}>
                    <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </div>
                    <div className="flex items-start flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        {isMuted ? "Хотите скрасить регистрацию?" : "Управление звуком"}
                      </span>
                      <span className="text-xs text-white/40">
                        {isMuted ? "Нажмите чтобы включить звук" : `Громкость: ${volume}%`}
                      </span>
                    </div>
                  </div>
                  {!isMuted && (
                    <div className="w-[100px] flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Slider
                        defaultValue={[volume]}
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
});

Auth.displayName = "Auth";
export default Auth;