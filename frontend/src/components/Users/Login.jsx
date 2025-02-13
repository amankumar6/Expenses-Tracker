import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";

import AlertMessage from "../Alert/AlertMessage";
import { loginAPI } from "../../services/userServices";
import { loginAction } from "../../redux/slice/authSlice";

// Validations
const validationSchema = Yup.object({
    emailOrUsername: Yup.string()
        .required("Email or Username is Required!"),
    password: Yup.string()
        .min(5, "Password must be at least 5 character ")
        .required("Password is required"),
});

const LoginForm = () => {
    const navigate = useNavigate();

    // Mutation
    const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
        mutationFn: loginAPI,
        mutationKey: ["login"],
    });

    // Dispatch
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            emailOrUsername: "",
            password: "",
        },
        // validations
        validationSchema,
        onSubmit: async (values) => {
            try {
                const data = await mutateAsync(values);
                // Store user data first
                localStorage.setItem("userInfo", JSON.stringify(data));
                // Then dispatch the action
                dispatch(loginAction(data));
                // Small delay to ensure token is stored before navigation
                setTimeout(() => {
                    navigate("/dashboard");
                }, 100);
            } catch (error) {
                console.error(error);
            }
        },
    });

    useEffect(() => {
        if (isSuccess) {
            navigate("/dashboard");
        }
    }, [isPending, isError, error, isSuccess]);

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200"
        >
            <h2 className="text-3xl font-semibold text-center text-gray-800">
                Login
            </h2>
            {/* Display messages */}
            {isPending && (
                <AlertMessage type="loading" message="Login you in..." />
            )}

            {isError && (
                <AlertMessage
                    type="error"
                    message={error.response.data.message}
                />
            )}

            {isSuccess && (
                <AlertMessage type="success" message="Login is success" />
            )}

            <p className="text-sm text-center text-gray-500">
                Login to access your account
            </p>

            {/* Input Field - Email/Username */}
            <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                <input
                    id="emailOrUsername"
                    type="text"
                    {...formik.getFieldProps("emailOrUsername")}
                    placeholder="Email or Username"
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.emailOrUsername && formik.errors.emailOrUsername && (
                    <span className="text-xs text-red-500">
                        {formik.errors.emailOrUsername}
                    </span>
                )}
            </div>

            {/* Input Field - Password */}
            <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                    id="password"
                    type="password"
                    {...formik.getFieldProps("password")}
                    placeholder="Password"
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.password && formik.errors.password && (
                    <span className="text-xs text-red-500">
                        {formik.errors.password}
                    </span>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
                Login
            </button>

            <div className="flex items-center justify-between">
                <Link
                    to="/register"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                    Create an account
                </Link>
                <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                    Forgot password?
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;
