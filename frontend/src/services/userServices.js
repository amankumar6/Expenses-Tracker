import axios from "axios";
import {
    BASE_URL,
    CHANGE_USER_PASSWORD,
    LOGIN_USER,
    REGISTER_USER,
    UPDATE_USER,
} from "../utils/url";
import { getUserTokenFromLocalStorage } from "../utils/getUserTokenFromLocalStorage";

const token = getUserTokenFromLocalStorage();

// LOGIN
export const loginAPI = async ({ email, password }) => {
    const response = await axios.post(`${BASE_URL}${LOGIN_USER}`, {
        email,
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
export const updatePasswordAPI = async (newPassword) => {
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
