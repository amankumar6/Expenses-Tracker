import axios from "axios";
import {
    BASE_URL,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    CREATE_CATEGORY,
    READ_CATEGORY,
} from "../utils/url";
import { getUserTokenFromLocalStorage } from "../utils/getUserTokenFromLocalStorage";

const token = getUserTokenFromLocalStorage();

// CREATE
export const addCategoryAPI = async ({ name, type }) => {
    const url = `${BASE_URL}${CREATE_CATEGORY}`;
    const response = await axios.post(
        url,
        {
            name,
            type,
        },
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return response.data;
};

// READ
export const fetchingCategoryAPI = async (context) => {
    try {
        const filters = context?.queryKey?.[1] || {};
        let url = `${BASE_URL}${READ_CATEGORY}`;

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
        throw error;
    }
};

// UPDATE
export const updateCategoryAPI = async ({ name, type, categoryId }) => {
    const url = `${BASE_URL}${UPDATE_CATEGORY}/${categoryId}`;
    const response = await axios.put(
        url,
        {
            name,
            type,
        },
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return response.data;
};

// DELETE
export const deleteCategoryAPI = async (id) => {
    const url = `${BASE_URL}${DELETE_CATEGORY}/${id}`;
    const response = await axios.delete(url, {
        headers: {
            Authorization: token,
        },
    });

    return response.data;
};
