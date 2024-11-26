import { setToken, logOut } from "./authSlice";
import { loginThunk, registerThunk, logoutThunk } from "./authApiSlice";

const actionFullLogin = ({ username, password }) =>
    async (dispatch) => {
        try {
            const userData = await dispatch(loginThunk({ username, password })).unwrap();

            if (userData?.access_token) {
                dispatch(setToken({ ...userData }));

                // додати стягнення інфо про юзера
                // const userInfo = await dispatch(getUserByUsernameThunk(username));
            } else {
                console.error('Помилка при авторизації: Невірні дані');
                throw new Error('Невірні дані для авторизації');
            }
        } catch (error) {
            console.error('Помилка при виконанні actionFullLogin:', error);
            throw error;
        }
    }


const actionFullRegister = ({ username, password, confirmPassword }) =>
    async (dispatch) => {
        try {
            const registerResponse = await dispatch(registerThunk({ username, password, confirmPassword })).unwrap();

            console.log('registerResponse', registerResponse);
            if (registerResponse?.id) {
                console.log("Реєстрація успішна:", registerResponse.data);

                await dispatch(actionFullLogin({ username, password }));

            } else {
                throw new Error(registerResponse?.message || "Реєстрація не вдалася.");
            }
        } catch (error) {
            console.error("Помилка при виконанні actionFullRegister:", error.message);
            throw error;
        }
    };

const actionFullLogout = () => async (dispatch) => {
    try {
        await dispatch(logoutThunk()).unwrap();
        console.log("Логаут успішний.");

        dispatch(logOut());
    } catch (error) {
        console.error("Помилка при виконанні actionFullLogout:", error.message);
    }
};

export { actionFullLogin, actionFullRegister, actionFullLogout };