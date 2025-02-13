import axios from "axios";
import {
    BASE_URL,
    CHANGE_USER_PASSWORD,
    LOGIN_USER,
    REGISTER_USER,
    UPDATE_USER,
} from "../utils/url";
import { getUserTokenFromLocalStorage } from "../utils/getUserTokenFromLocalStorage";

// Create axios instance with default config
const api = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// LOGIN
export const loginAPI = async ({ emailOrUsername, password }) => {
    try {
        const response = await api.post(`${BASE_URL}${LOGIN_USER}`, {
            emailOrUsername,
            password,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(error.response.data.message || 'Login failed');
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error('Error setting up request');
        }
    }
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
