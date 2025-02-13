import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { useFormik } from "formik";

import AlertMessage from "../Alert/AlertMessage";
import { logoutAction } from "../../redux/slice/authSlice";
import { updateProfileAPI } from "../../services/userServices";

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state?.auth?.user);

    const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
        mutationFn: updateProfileAPI,
        mutationKey: ["updateProfile"],
    });

    const formik = useFormik({
        initialValues: {
            email: user?.email || "",
            username: user?.username || "",
        },
        onSubmit: (values) => {
            mutateAsync(values)
                .then((data) => {
                    dispatch(logoutAction());
                    localStorage.removeItem("userInfo");
                    navigate("/login");
                })
                .catch((e) => console.log(e));
        },
    });

    return (
        <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md">
            <h1 className="mb-2 text-2xl text-center font-extrabold">
                Welcome {user?.username}
                <span className="text-gray-500 text-sm ml-2">
                    {user?.email}
                </span>
            </h1>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Update Profile
                </h3>

                {/* Display messages */}
                {isPending && (
                    <AlertMessage type="loading" message="Updating profile..." />
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
                        message="Profile updated successfully"
                    />
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Username field */}
                    <div className="relative">
                        <FaUserCircle className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="text"
                            {...formik.getFieldProps("username")}
                            placeholder="Username"
                            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email field */}
                    <div className="relative">
                        <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="email"
                            {...formik.getFieldProps("email")}
                            placeholder="Email"
                            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        Save Changes
                    </button>
                </form>
            </div>

            {/* Link to Change Password page */}
            <div className="mt-6 text-center">
                <Link
                    to="/change-password"
                    className="inline-flex items-center text-blue-500 hover:text-blue-600"
                >
                    <FaLock className="mr-2" />
                    Change Password
                </Link>
            </div>
        </div>
    );
};

export default UserProfile;
