import React, { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { FaWallet } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
    fetchingCategoryAPI,
    updateCategoryAPI,
} from "../../services/categoryServices";
import AlertMessage from "../Alert/AlertMessage";

const validationSchema = Yup.object({
    name: Yup.string()
        .required("Category name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    type: Yup.string()
        .required("Category type is required")
        .oneOf(["income", "expense"]),
});

const UpdateCategory = () => {
    const [initialValues, setInitialValues] = useState({
        type: "",
        name: "",
    });

    const { categoryId } = useParams();
    const navigate = useNavigate();

    // Mutation for update
    const { data: category } = useQuery({
        queryFn: fetchingCategoryAPI,
        queryKey: ["listCategories", categoryId],
    });

    const { mutateAsync, isError, error, isSuccess } = useMutation({
        mutationFn: updateCategoryAPI,
        mutationKey: ["updateCategory"],
    });

    useEffect(() => {
        if (category) {
            setInitialValues({
                type: category.type,
                name: category.name,
            });
        }
    }, [category]);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const data = { ...values, categoryId };
            mutateAsync(data)
                .then((data) => {
                    navigate("/categories");
                })
                .catch((e) => console.log(e));
        },
        enableReinitialize: true,
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-lg space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Update Category
                </h2>
                <p className="text-gray-600">Fill in the details below.</p>
            </div>
            {/* Display alert message */}
            {isError && (
                <AlertMessage
                    type="error"
                    message={
                        error?.response?.data?.message ||
                        "Something happened please try again later"
                    }
                />
            )}
            {isSuccess && (
                <AlertMessage
                    type="success"
                    message="Category updated successfully, redirecting..."
                />
            )}
            {/* Category Type */}
            <div className="space-y-2">
                <label
                    htmlFor="type"
                    className="flex gap-2 items-center text-gray-700 font-medium"
                >
                    <FaWallet className="text-blue-500" />
                    <span>Type</span>
                </label>
                <select
                    {...formik.getFieldProps("type")}
                    id="type"
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <option value="">Select transaction type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                    <p className="text-red-500 text-xs">{formik.errors.type}</p>
                )}
            </div>

            {/* Category Name */}
            <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 font-medium">
                    <SiDatabricks className="inline mr-2 text-blue-500" />
                    Name
                </label>
                <input
                    type="text"
                    {...formik.getFieldProps("name")}
                    placeholder="Name"
                    id="name"
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                />
                {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-xs italic">
                        {formik.errors.name}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 transform"
            >
                Update Category
            </button>
        </form>
    );
};

export default UpdateCategory;
