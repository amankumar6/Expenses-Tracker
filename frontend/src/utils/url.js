// Base URLs for different environments
const BASE_URLS = {
    development: "http://localhost:8000/api/v1",
    production: "https://expenses-tracker-9es1.onrender.com/api/v1"
};

// Determine current environment
const currentEnv = import.meta.env.MODE || 'development';

// Export the appropriate BASE_URL
export const BASE_URL = BASE_URLS[currentEnv];

export const CREATE_CATEGORY = "/categories/create";
export const READ_CATEGORY = "/categories/lists";
export const UPDATE_CATEGORY = "/categories/update";
export const DELETE_CATEGORY = "/categories/delete";

export const CREATE_TRANSACTION = "/transaction/create";
export const READ_TRANSACTION = "/transaction/lists";
export const UPDATE_TRANSACTION = "/transaction/update";
export const DELETE_TRANSACTION = "/transaction/delete";

export const LOGIN_USER = "/users/login"
export const REGISTER_USER = "/users/register"
export const UPDATE_USER = "/users/updateProfile"
export const CHANGE_USER_PASSWORD = "/users/changePassword"