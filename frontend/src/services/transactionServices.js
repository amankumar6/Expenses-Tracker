import axios from "axios";
import {
    BASE_URL,
    CREATE_TRANSACTION,
    DELETE_TRANSACTION,
    READ_TRANSACTION,
    UPDATE_TRANSACTION,
} from "../utils/url";
import { getUserTokenFromLocalStorage } from "../utils/getUserTokenFromLocalStorage";

// CREATE
export const createTransactionAPI = async (formData) => {
    const token = getUserTokenFromLocalStorage(); // Get fresh token
    const config = {
        headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.post(
        `${BASE_URL}${CREATE_TRANSACTION}`,
        formData,
        config
    );

    return response.data;
};

// READ
export const fetchTransactionsAPI = async (context) => {
    try {
        const token = getUserTokenFromLocalStorage(); // Get fresh token
        const filters = context?.queryKey?.[1] || {};
        let url = `${BASE_URL}${READ_TRANSACTION}`;

        // Add query parameters if filters exist
        if (Object.keys(filters).length > 0) {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    queryParams.append(key, value);
                }
            });
            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('userInfo'); // Clear invalid token
            window.location.href = '/login'; // Force redirect to login
        }
        throw error;
    }
};

// UPDATE
export const updateTransactionAPI = async ({ id, formData }) => {
    const token = getUserTokenFromLocalStorage(); // Get fresh token
    const config = {
        headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.put(
        `${BASE_URL}${UPDATE_TRANSACTION}/${id}`,
        formData,
        config
    );

    return response.data;
};

// DELETE
export const deleteTransactionAPI = async (id) => {
    const token = getUserTokenFromLocalStorage(); // Get fresh token
    const response = await axios.delete(
        `${BASE_URL}${DELETE_TRANSACTION}/${id}`,
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return response.data;
};
