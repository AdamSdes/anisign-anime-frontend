'use client';

import { useEffect, useState } from "react";
import { Label } from "@/shared/shadcn-ui/label";
import { AButton } from "@/shared/anisign-ui/Button";
import { AInput } from "@/shared/anisign-ui/Input";
import { ACheckbox } from "@/shared/anisign-ui/Checkbox";
import { ASwitch } from "@/shared/anisign-ui/Switch";
import Link from "next/link";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { actionFullLogin, actionFullRegister } from "@/features/auth/authActions";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const backgrounds = [
  '/auth-bg.png',
  '/auth-bg2.png',
  '/auth-bg3.jpg',
];

export function Auth() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: email, 2: code, 3: new password
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Смена фона каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Общие поля
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Дополнительные поля для регистрации
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasAgreedToToS, setHasAgreedToToS] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.accessToken !== null);

  const toggleRememberMe = () => setRememberMe(!rememberMe);
  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleAgreedToToS = () => setHasAgreedToToS(!hasAgreedToToS);
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword("");
    setConfirmPassword("");
    setHasAgreedToToS(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Все поля должны быть заполнены", {
        duration: 4000,
      });
      return;
    }

    if (!isLogin) {
      if (!confirmPassword) {
        toast.error("Все поля должны быть заполнены", { duration: 4000 });
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Пароли не совпадают", { duration: 4000 });
        return;
      }

      if (!hasAgreedToToS) {
        toast.error("Вы должны согласиться с правилами сайта", { duration: 4000 });
        return;
      }
    }

    try {
      if (isLogin) {
        await dispatch(actionFullLogin({ username, password, rememberMe }));
        toast.success("Вы успешно вошли в систему!", {
          duration: 4000,
        });
      } else {
        await dispatch(actionFullRegister({ username, password, confirmPassword, rememberMe }));
        toast.success("Регистрация прошла успешно!", { duration: 4000 });
      }
    } catch (error) {
      console.log("Error at handleSubmit", error);

      let errorMsg = isLogin
        ? "Произошла ошибка при авторизации"
        : "Произошла ошибка при регистрации";

      if (error.response && error.response.status === 401) {
        errorMsg = "Неправильный логин или пароль";
      } else if (error.response && error.response.status === 500) {
        errorMsg = "Ошибка сервера. Пожалуйста, попробуйте позже.";
      } else if (error.message) {
        errorMsg = error.message;
      }

      toast.error(errorMsg, {
        duration: 4000,
      });
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    try {
      switch (recoveryStep) {
        case 1:
          // Отправка email для восстановления
          toast.success("Код восстановления отправлен на почту");
          setRecoveryStep(2);
          break;
        case 2:
          // Проверка кода
          if (recoveryCode.length === 6) {
            setRecoveryStep(3);
          } else {
            toast.error("Неверный код подтверждения");
          }
          break;
        case 3:
          // Установка нового пароля
          if (newPassword === confirmNewPassword) {
            toast.success("Пароль успешно изменен!");
            setIsRecovery(false);
            setIsLogin(true);
            // Сброс всех полей восстановления
            setRecoveryStep(1);
            setRecoveryEmail("");
            setRecoveryCode("");
            setNewPassword("");
            setConfirmNewPassword("");
          } else {
            toast.error("Пароли не совпадают");
          }
          break;
      }
    } catch (error) {
      toast.error("Произошла ошибка при восстановлении пароля");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/");
    }
  }, [isAuthenticated]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const RecoveryForm = () => (
    <motion.form
      variants={containerVariants}
      className="flex flex-col gap-[35px] w-full"
      onSubmit={handleRecovery}
    >
      <motion.div variants={itemVariants} className="grid gap-3 w-full">
        {recoveryStep === 1 && (
          <AInput
            type="email"
            placeholder="Email для восстановления"
            size="xl"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            startContent={
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                <rect x="1" y="1" width="20" height="16" rx="5" stroke="#8B8B8B" strokeWidth="1.5"/>
                <path d="M5 6L9.8 9.6C10.5111 10.1333 11.4889 10.1333 12.2 9.6L17 6" stroke="#8B8B8B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
        )}
        {recoveryStep === 2 && (
          <AInput
            type="text"
            placeholder="Введите код из письма"
            size="xl"
            value={recoveryCode}
            onChange={(e) => setRecoveryCode(e.target.value)}
            maxLength={6}
          />
        )}
        {recoveryStep === 3 && (
          <>
            <AInput
              type="password"
              placeholder="Новый пароль"
              size="xl"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <AInput
              type="password"
              placeholder="Подтвердите новый пароль"
              size="xl"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-2">
        <AButton 
          className="w-full" 
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {recoveryStep === 1 ? "Отправить" : recoveryStep === 2 ? "Подтвердить" : "Сохранить"}
        </AButton>
        <AButton
          className="h-[58px]"
          color="gray"
          onClick={() => {
            setIsRecovery(false);
            setRecoveryStep(1);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Назад
        </AButton>
      </motion.div>
    </motion.form>
  );

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgrounds[currentBgIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>
      <div className="relative flex items-center justify-center md:justify-end w-full h-screen">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#060606] mx-4 md:mx-0 md:mr-[175px] p-[25px] md:p-[50px] rounded-[24px] w-full md:w-[490px]"
          onKeyDown={handleKeyDown}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-between items-center gap-[35px]"
          >
            <motion.div 
              variants={itemVariants}
              className="flex justify-between items-center w-full"
            >
              <motion.p
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-semibold"
              >
                {isLogin ? "Добро пожаловать ✌️" : "Регистрация"}
              </motion.p>
              <Link
                href="/"
                className="bg-red px-[15px] h-[33px] border rounded-full flex items-center"
              >
                <img src="/left-icon.svg" className="w-[17px]" alt="" />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex w-full gap-2">
              <AButton
                color="gray"
                className="w-full"
                startContent={
                  <img src="/google.svg" className="w-[24px] h-[20px]" />
                }
              >
                Google
              </AButton>
              <AButton
                color="gray"
                className="w-full"
                startContent={
                  <img src="/discord.svg" className="w-[24px] h-[24px]" />
                }
              >
                Discord
              </AButton>
            </motion.div>
            <motion.div variants={itemVariants} className="w-full h-[1px] bg-white/5 opacity-10" />

            <AnimatePresence mode="wait">
              {isRecovery ? (
                <RecoveryForm />
              ) : (
                <motion.form
                  variants={containerVariants}
                  className="flex flex-col gap-[35px] w-full"
                  onSubmit={handleSubmit}
                >
                  <motion.div variants={itemVariants} className="grid gap-3 w-full">
                    <AInput
                      type="email"
                      placeholder="Логин"
                      size="xl"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      startContent={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="18"
                          viewBox="0 0 22 18"
                          fill="none"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="20"
                            height="16"
                            rx="5"
                            stroke="#8B8B8B"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M5 6L9.8 9.6C10.5111 10.1333 11.4889 10.1333 12.2 9.6L17 6"
                            stroke="#8B8B8B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                    />
                    <AInput
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Пароль"
                      size="xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      startContent={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 18 20"
                          fill="none"
                        >
                          <rect
                            x="1"
                            y="7"
                            width="16"
                            height="12"
                            rx="4"
                            stroke="#8B8B8B"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M9 14L9 12"
                            stroke="#8B8B8B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13 7V5C13 2.79086 11.2091 1 9 1V1C6.79086 1 5 2.79086 5 5L5 7"
                            stroke="#8B8B8B"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AInput
                            type="password"
                            placeholder="Повторите Пароль"
                            size="xl"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            startContent={
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 18 20"
                                fill="none"
                              >
                                <rect
                                  x="1"
                                  y="7"
                                  width="16"
                                  height="12"
                                  rx="4"
                                  stroke="#8B8B8B"
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M9 14L9 12"
                                  stroke="#8B8B8B"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M13 7В5C13 2.79086 11.2091 1 9 1В1C6.79086 1 5 2.79086 5 5L5 7"
                                  stroke="#8B8B8B"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {isLogin ? (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center space-x-2 w-full"
                      >
                        <ACheckbox
                          id="remember-me"
                          checked={rememberMe}
                          onCheckedChange={toggleRememberMe}
                        />
                        <Label htmlFor="remember-me" className="opacity-70 font-normal">
                          Запомнить меня
                        </Label>
                        <button
                          onClick={() => setIsRecovery(true)}
                          className="text-sm text-[#B6D0F7] hover:underline"
                        >
                          Забыли пароль?
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="register"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center space-x-2"
                      >
                        <ASwitch
                          selected={hasAgreedToToS}
                          onChange={toggleAgreedToToS}
                          aria-label="Automatic updates"
                        />
                        <Label htmlFor="airplane-mode" className="opacity-70 font-normal">
                          Согласен с <a className="text-[#B6D0F7]" href="youtube.com">правилами</a> сайта
                        </Label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants} className="flex gap-2">
                    <AButton 
                      className="w-full" 
                      onClick={handleSubmit}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLogin ? "Войти" : "Создать"}
                    </AButton>
                    <AButton
                      className="h-[58px]"
                      color="gray"
                      onClick={toggleMode}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLogin ? "Регистрация" : "Войти"}
                    </AButton>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
