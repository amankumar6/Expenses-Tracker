import React, { useEffect, useState } from "react";
import { getUserTokenFromLocalStorage } from "../../utils/getUserTokenFromLocalStorage";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const AuthRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector(state => state?.auth?.user);
    const token = getUserTokenFromLocalStorage();

    useEffect(() => {
        // Check if we have both token and user data
        if (token && user) {
            setIsLoading(false);
        } else if (!token) {
            setIsLoading(false);
        }
    }, [token, user]);

    if (isLoading) {
        return <div>Loading...</div>; // You can replace this with a proper loading spinner
    }

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AuthRoute;
