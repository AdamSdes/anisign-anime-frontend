import { setToken, setUserInfo, logOut } from "./authSlice";
import { loginThunk, registerThunk, logoutThunk, getUserByUsernameThunk } from "./authApiSlice";

const actionFullLogin = ({ username, password }) =>
    async (dispatch) => {
        try {
            const userToken = await dispatch(loginThunk({ username, password })).unwrap();

            if (userToken?.access_token) {
                dispatch(setToken({ ...userToken }));

                try {
                    // Стягуємо інформацію про користувача
                    const userInfo = await dispatch(getUserByUsernameThunk(username)).unwrap();
                    dispatch(setUserInfo({ ...userInfo }));
                } catch (error) {
                    console.error('Error at getUserByUsernameThunk:', error);
                }
            } else {
                console.error('Authorization error: Invalid data');
                throw new Error('Authorization error: Invalid data');
            }
        } catch (error) {
            console.error('Error at actionFullLogin:', error);
            throw error;
        }
    }


const actionFullRegister = ({ username, password, confirmPassword }) =>
    async (dispatch) => {
        try {
            const registerResponse = await dispatch(registerThunk({ username, password, confirmPassword })).unwrap();

            console.log('registerResponse', registerResponse);
            if (registerResponse?.id) {

                await dispatch(actionFullLogin({ username, password }));

            } else {
                throw new Error(registerResponse?.message || "Registration error.");
            }
        } catch (error) {
            console.error("Error at actionFullRegister:", error.message);
            throw error;
        }
    };

const actionFullLogout = () => async (dispatch) => {
    try {
        await dispatch(logoutThunk()).unwrap();
        console.log("Logged out successfully.");

        dispatch(logOut());
    } catch (error) {
        console.error("Error at actionFullLogout:", error.message);
    }
};

export { actionFullLogin, actionFullRegister, actionFullLogout };