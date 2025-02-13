import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaLock } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

import AlertMessage from "../Alert/AlertMessage";
import { changePasswordAPI } from "../../services/userServices";

// Validation schema
const validationSchema = Yup.object({
    password: Yup.string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required"),
});

const ChangePassword = () => {
    const navigate = useNavigate();
    const [captchaValue, setCaptchaValue] = useState(null);

    const { mutateAsync, isPending, isError, error } = useMutation({
        mutationFn: changePasswordAPI,
        mutationKey: ["changePassword"],
    });

    const formik = useFormik({
        initialValues: {
            password: "",
        },
        validationSchema,
        onSubmit: (values) => {
            if (!captchaValue) {
                alert("Please verify that you are human!");
                return;
            }
            mutateAsync({ ...values, captcha: captchaValue })
                .then(() => {
                    navigate("/profile");
                })
                .catch((e) => console.log(e));
        },
    });

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    return (
        <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
                Change Password
            </h2>

            {/* Error message */}
            {isError && (
                <AlertMessage type="error" message={error?.response?.data?.message} />
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* New Password Field */}
                <div className="relative">
                    <FaLock className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter new password"
                        {...formik.getFieldProps("password")}
                        className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <span className="text-xs text-red-500">
                            {formik.errors.password}
                        </span>
                    )}
                </div>

                {/* ReCAPTCHA */}
                <div className="flex justify-center my-4">
                    <ReCAPTCHA
                        sitekey="6LcNSNYqAAAAAPYwe6p4-Rc_uRUu-i7XBPMFPles"
                        onChange={handleCaptchaChange}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending || !captchaValue}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
                >
                    {isPending ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
