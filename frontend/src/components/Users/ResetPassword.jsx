import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FaLock } from 'react-icons/fa';
import { useFormik } from "formik";
import * as Yup from "yup";

import { resetPasswordAPI } from '../../services/userServices';
import AlertMessage from '../Alert/AlertMessage';

// Validations
const validationSchema = Yup.object({
    password: Yup.string()
        .min(5, "Password must be at least 5 characters long")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
});

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
        mutationFn: resetPasswordAPI,
        mutationKey: ['resetPassword'],
        onSuccess: () => {
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        },
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            await mutateAsync({ token, password: values.password });
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200"
        >
            <h2 className="text-3xl font-semibold text-center text-gray-800">
                Reset Password
            </h2>

            {/* Display messages */}
            {isPending && (
                <AlertMessage type="loading" message="Updating password..." />
            )}
            {isError && (
                <AlertMessage
                    type="error"
                    message={error?.response?.data?.message}
                />
            )}
            {isSuccess && (
                <AlertMessage
                    type="success"
                    message="Password updated successfully! Redirecting to login..."
                />
            )}

            <p className="text-sm text-center text-gray-500">
                Enter your new password below
            </p>

            {/* Input Field - Password */}
            <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                    type="password"
                    id="password"
                    {...formik.getFieldProps("password")}
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="New password"
                />
                {formik.touched.password && formik.errors.password && (
                    <span className="text-xs text-red-500">
                        {formik.errors.password}
                    </span>
                )}
            </div>

            {/* Input Field - Confirm Password */}
            <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                    type="password"
                    id="confirmPassword"
                    {...formik.getFieldProps("confirmPassword")}
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Confirm new password"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <span className="text-xs text-red-500">
                        {formik.errors.confirmPassword}
                    </span>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
                Reset Password
            </button>
        </form>
    );
};

export default ResetPassword;
