import { z } from 'zod';

export const loginSchema = z.object({
    username: z
        .string()
        .min(8, { message: 'Имя пользователя должно содержать минимум 8 символов' })
        .max(20, { message: 'Имя пользователя не должно превышать 20 символов' }),
    password: z
        .string()
        .min(6, { message: 'Пароль должен содержать минимум 6 символов' })
        .max(50, { message: 'Пароль не должен превышать 50 символов' }),
    remember_me: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: 'Имя пользователя должно содержать минимум 6 символов' })
      .max(20, { message: 'Имя пользователя не должно превышать 20 символов' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Имя пользователя может содержать только буквы, цифры и знак подчеркивания',
      }),
    password: z
      .string()
      .min(6, { message: 'Пароль должен содержать минимум 6 символов' })
      .max(50, { message: 'Пароль не должен превышать 50 символов' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message: 'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

export type LoginSchema = z.infer<typeof loginSchema>;

export type RegisterSchema = z.infer<typeof registerSchema>;