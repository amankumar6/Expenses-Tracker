import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FaEnvelope } from 'react-icons/fa';
import { useFormik } from "formik";
import * as Yup from "yup";

import { forgotPasswordAPI } from '../../services/userServices';
import AlertMessage from '../Alert/AlertMessage';

// Validations
const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
});

const ForgotPassword = () => {
    const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
        mutationFn: forgotPasswordAPI,
        mutationKey: ['forgotPassword'],
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            await mutateAsync(values);
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200"
        >
            <h2 className="text-3xl font-semibold text-center text-gray-800">
                Forgot Password
            </h2>

            {/* Display messages */}
            {isPending && (
                <AlertMessage type="loading" message="Sending reset link..." />
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
                    message="Password reset link sent to your email!"
                />
            )}

            <p className="text-sm text-center text-gray-500">
                Enter your email address and we'll send you a link to reset your password
            </p>

            {/* Input Field - Email */}
            <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                <input
                    type="email"
                    id="email"
                    {...formik.getFieldProps("email")}
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Email address"
                />
                {formik.touched.email && formik.errors.email && (
                    <span className="text-xs text-red-500">
                        {formik.errors.email}
                    </span>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
                Send Reset Link
            </button>

            <div className="flex items-center justify-center">
                <Link
                    to="/login"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                    Back to Login
                </Link>
            </div>
        </form>
    );
};

export default ForgotPassword;
