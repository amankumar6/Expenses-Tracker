import axios from "axios";
import {
    BASE_URL,
    CHANGE_USER_PASSWORD,
    LOGIN_USER,
    REGISTER_USER,
    UPDATE_USER,
} from "../utils/url";
import { getUserTokenFromLocalStorage } from "../utils/getUserTokenFromLocalStorage";

// LOGIN
export const loginAPI = async ({ emailOrUsername, password }) => {
    const response = await axios.post(`${BASE_URL}${LOGIN_USER}`, {
        emailOrUsername,
        password,
    });

    return response.data;
};

// REGISTER
export const registerAPI = async ({ username, email, password }) => {
    const response = await axios.post(`${BASE_URL}${REGISTER_USER}`, {
        username,
        email,
        password,
    });

    return response.data;
};

// UPDATE
export const updateProfileAPI = async ({ username, email }) => {
    const token = getUserTokenFromLocalStorage(); // Get fresh token for each request
    const response = await axios.put(
        `${BASE_URL}${UPDATE_USER}`,
        {
            username,
            email,
        },
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return response.data;
};

// CHANGE PASSWORD
export const changePasswordAPI = async ({ password, captcha }) => {
    const token = getUserTokenFromLocalStorage(); // Get fresh token for each request
    const response = await axios.put(
        `${BASE_URL}${CHANGE_USER_PASSWORD}`,
        {
            password,
            captcha
        },
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return response.data;
};

// CHANGE PASSWORD
export const updatePasswordAPI = async (newPassword) => {
    const token = getUserTokenFromLocalStorage(); // Get fresh token for each request
    const response = await axios.put(
        `${BASE_URL}${CHANGE_USER_PASSWORD}`,
        {
            newPassword,
        },
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return response.data;
};

// FORGOT PASSWORD
export const forgotPasswordAPI = async ({ email }) => {
    const response = await axios.post(
        `${BASE_URL}/users/forgot-password`,
        { email }
    );
    return response.data;
};

// RESET PASSWORD
export const resetPasswordAPI = async ({ token, password }) => {
    const response = await axios.post(
        `${BASE_URL}/users/reset-password`,
        { token, password }
    );
    return response.data;
};
