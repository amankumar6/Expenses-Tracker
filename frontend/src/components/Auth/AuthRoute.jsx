import React from "react";
import { getUserTokenFromLocalStorage } from "../../utils/getUserTokenFromLocalStorage";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
    const token = getUserTokenFromLocalStorage();

    if (token) {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
};

export default AuthRoute;
