import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/shared/types/user";

const mockUser: User = {
    id: '3854a44f-5073-4e99-95cc-10e2741e3f5d', 
    username: 'whychmo',
    user_avatar: '/uploads/avatars/3854a44f-5073-4e99-95cc-10e2741e3f5d.png',
    status: 'user',
    nickname: 'whychmo',
    password: '$2b$12$7UnmD7qcm7Tl9uxLY0GSkeG1PWaAup8RyvKAQ2YDxZWp4v8Ud3JXS', 
    user_banner: null,
};
  
 
const resetMockUser = (): User => ({
    id: crypto.randomUUID(),
    username: 'defaultUser',
    user_avatar: null,
    status: 'user',
    nickname: 'defaultUser',
    password: 'defaultHashedPassword', 
    user_banner: null,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            if (req.url === '/') {
                // Получение всех пользователей
                res.status(200).json([mockUser]);
            } else if (req.url === `/get-user/{id}`) {
                // Получение пользователя по id
                const { user_id } = req.query;
                res.status(200).json(mockUser);
            } else if (req.url === '/name/{name}') {
                // Получение пользователя по имени
                res.status(200).json(mockUser);
            } else if (req.url === '/get-user-by-username/{username}') {
                // Получение пользователя по username
                const { userame } = req.query;
                if (userame === mockUser.username) {
                    res.status(200).json(mockUser);
                } else {
                    res.status(404).json({ message: 'Пользователь не найден' });
                }
            } else if (req.url === '/get-user-by-email/{email}') {
                // Получение пользователя по почте
                const { email } = req.query;
                if (email === mockUser.email) {
                    res.status(200).json(mockUser);
                } else {
                    res.status(404).json({ error: 'Пользователь не найден' });
                }
            }
        break;
        case 'POST':
            if (req.url === '/create-user') {
                // Регистрация
                const { username, password, user_avatar, status, nickname, user_banner } = req.body;
                if (username && password) {
                    const newUser: User = {
                        id: crypto.randomUUID(), 
                        username,
                        user_avatar: user_avatar || null,
                        status: status || 'user',
                        nickname: nickname || username,
                        password, 
                        user_banner: user_banner || null,
                    };
                    res.status(201).json({ message: 'Пользователь создан', user: newUser });
                } else {
                    res.status(400).json({ error: 'Заполните все обязательные поля' });
                }
            } else if (req.url === '/change-my-password') {
                // Изменение пароля
                const { id, email, old_password, new_password } = req.body;
                if (!id || !old_password || !new_password || !email) {
                    return res.status(400).json({ error: 'Заполните все обязательные поля' });
                }
                if (email !== mockUser.email || old_password !== mockUser.password) {
                    return res.status(401).json({ error: 'Неправильная почта или пароль' });
                }
                mockUser.password = new_password;
                res.status(200).json({ message: 'Пароль изменен', id });
            }
        break;
        case 'PUT':
            if (req.url === '/update-my-nickname') {
                // Изменение никнейма
                const { id, nickname, email } = req.body;
                if (id && nickname && email === mockUser.email) {
                    res.status(200).json({ message: 'Никнейм изменён', id, nickname });
                } else {
                    res.status(400).json({ error: 'Неправильные никнейм или почта' });
                }
            } else if (req.url === '/update-my-avatar') {
                // Изменение аватара
                const { id, user_avatar, email } = req.body;
                if (id && user_avatar && email === mockUser.email) {
                    mockUser.user_avatar = user_avatar || mockUser.user_avatar;
                    res.status(200).json({ message: 'Аватар обновлен', id, user_avatar: mockUser.email })
                }
            }
        break;
        case 'DELETE':
            if (req.url === '/delete-user') {
                // Удаление пользователя
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({ error: 'Заполните все обязательные поля' });
                }
                if (email !== mockUser.email || password !== mockUser.password) {
                    return res.status(401).json({ error: 'Неправильная почта или пароль' });
                }
                res.status(200).json({ message: `Пользователь ${mockUser.user_id} удалён успешно`});
            }
        break;
        default:
            res.status(400).json({ error: 'Метод не поддерживаеться' });
    }
}