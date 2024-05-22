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

// export const fetchingCategoryAPI = async (categoryId = null) => {
//     let url = `${BASE_URL}${READ_CATEGORY}`;
//     let respose;
//     console.log(categoryId.queryKey[1]);
//     if (categoryId !== null) {
//         const categoryIdStr = String(categoryId);
//         url += `/${categoryIdStr}`;
//         response = await axios.get(url, {
//             params: {
//                 categoryId,
//             },
//             headers: {
//                 Authorization: token,
//             },
//         });
//     }
//     response = await axios.get(url, {
//         headers: {
//             Authorization: token,
//         },
//     });
//     return response.data;
// };

export const fetchingCategoryAPI = async ({ queryKey }) => {
    const [_key, id] = queryKey;
    let url = `${BASE_URL}${READ_CATEGORY}`;
    if (id) {
        url = `${url}?id=${id}`;
    }
    const response = await axios.get(url, {
        headers: {
            Authorization: token,
        },
    });
    return response.data;
};

// export const fetchingCategoryAPI = async () => {
//     const url = `${BASE_URL}${READ_CATEGORY}`;
//     const response = await axios.get(url, {
//         headers: {
//             Authorization: token,
//         },
//     });
//     return response.data;
// };

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
