import axios from "axios";
import {
    BASE_URL,
    CREATE_TRANSACTION,
    DELETE_TRANSACTION,
    READ_TRANSACTION,
    UPDATE_TRANSACTION,
} from "../utils/url";
import { getUserTokenFromLocalStorage } from "../utils/getUserTokenFromLocalStorage";

const token = getUserTokenFromLocalStorage();

// CREATE
export const addTransactionAPI = async ({
    type,
    category,
    amount,
    date,
    description,
}) => {
    const response = await axios.post(
        `${BASE_URL}${CREATE_TRANSACTION}`,
        {
            type,
            category,
            amount,
            date,
            description,
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
export const getTransactionsAPI = async ({
    startDate,
    endDate,
    type,
    category,
    id,
}) => {
    const response = await axios.get(`${BASE_URL}${READ_TRANSACTION}`, {
        params: { startDate, endDate, type, category, id },
        headers: {
            Authorization: token,
        },
    });
    return response.data;
};

// UPDATE
export const updateTransactionAPI = async ({
    type,
    category,
    amount,
    date,
    description,
    transactionId,
}) => {
    const response = await axios.put(
        `${BASE_URL}${UPDATE_TRANSACTION}/${transactionId}`,
        {
            type,
            category,
            amount,
            date,
            description,
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
export const deleteTransactionAPI = async (id) => {
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
