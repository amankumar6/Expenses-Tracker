import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    FaDollarSign,
    FaCalendarAlt,
    FaRegCommentDots,
    FaWallet,
    FaReceipt,
} from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";

import { fetchingCategoryAPI } from "../../services/categoryServices";
import {
    createTransactionAPI,
    fetchTransactionsAPI,
    updateTransactionAPI,
} from "../../services/transactionServices";
import AlertMessage from "../Alert/AlertMessage";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];

const validationSchema = Yup.object({
    type: Yup.string()
        .required("Transaction type is required")
        .oneOf(["income", "expense"]),
    amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive"),
    category: Yup.string().required("Category is required"),
    date: Yup.date().required("Date is required"),
    description: Yup.string(),
    receipt: Yup.mixed()
        .nullable()
        .test("fileSize", "File is too large (max 5MB)", (value) => 
            !value || value.size <= MAX_FILE_SIZE
        )
        .test("fileType", "Unsupported file format", (value) =>
            !value || SUPPORTED_IMAGE_FORMATS.includes(value.type)
        )
});

const TransactionForm = () => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const [receiptPreview, setReceiptPreview] = useState(null);

    // Query for categories
    const { data: categories } = useQuery({
        queryFn: fetchingCategoryAPI,
        queryKey: ["listCategories"],
    });

    // Query for existing transaction if editing
    const { data: existingTransaction } = useQuery({
        queryFn: () => fetchTransactionsAPI({ queryKey: ["transactions", { id: transactionId }] }),
        queryKey: ["transaction", transactionId],
        enabled: !!transactionId,
    });

    // Mutations
    const { mutateAsync: createTransaction, isError, error, isSuccess, isPending } = useMutation({
        mutationFn: createTransactionAPI,
        mutationKey: ["createTransaction"],
    });

    const { mutateAsync: updateTransaction } = useMutation({
        mutationFn: updateTransactionAPI,
        mutationKey: ["updateTransaction"],
    });

    const formik = useFormik({
        initialValues: {
            type: "",
            amount: "",
            category: "",
            date: new Date().toISOString().split('T')[0],
            description: "",
            receipt: null
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('type', values.type);
                formData.append('category', values.category);
                formData.append('amount', values.amount);
                formData.append('date', values.date);
                formData.append('description', values.description || '');
                
                if (values.receipt) {
                    formData.append('receipt', values.receipt);
                }

                if (transactionId) {
                    await updateTransaction({ id: transactionId, formData });
                } else {
                    await createTransaction(formData);
                }

                // Success - will redirect after a short delay
                setTimeout(() => navigate("/dashboard"), 1500);
            } catch (error) {
                console.error('Error submitting transaction:', error);
            }
        },
    });

    // Update form with existing transaction data
    useEffect(() => {
        if (existingTransaction) {
            formik.setValues({
                type: existingTransaction.type || '',
                amount: existingTransaction.amount || '',
                category: existingTransaction.category || '',
                date: existingTransaction.date ? new Date(existingTransaction.date).toISOString().split('T')[0] : '',
                description: existingTransaction.description || '',
                receipt: null // Can't pre-fill file input
            });
            if (existingTransaction.receiptUrl) {
                setReceiptPreview(existingTransaction.receiptUrl);
            }
        }
    }, [existingTransaction]);

    // Handle receipt file change
    const handleReceiptChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            formik.setFieldValue('receipt', file);
            setReceiptPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-lg space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {transactionId ? "Update Transaction" : "Add Transaction"}
                </h2>
                <p className="text-gray-600">Fill in the transaction details below.</p>
            </div>

            {/* Display messages */}
            {isPending && (
                <AlertMessage type="loading" message="Processing transaction..." />
            )}
            {isError && (
                <AlertMessage
                    type="error"
                    message={error?.response?.data?.message || "Failed to process transaction"}
                />
            )}
            {isSuccess && (
                <AlertMessage
                    type="success"
                    message="Transaction processed successfully, redirecting..."
                />
            )}

            {/* Type Selection */}
            <div className="space-y-2">
                <label className="flex gap-2 items-center text-gray-700 font-medium">
                    <FaWallet className="text-blue-500" />
                    <span>Type</span>
                </label>
                <select
                    {...formik.getFieldProps("type")}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                >
                    <option value="">Select type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                    <div className="text-red-500 text-sm">{formik.errors.type}</div>
                )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
                <label className="flex gap-2 items-center text-gray-700 font-medium">
                    <FaDollarSign className="text-blue-500" />
                    <span>Amount</span>
                </label>
                <input
                    type="number"
                    {...formik.getFieldProps("amount")}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                    placeholder="Enter amount"
                />
                {formik.touched.amount && formik.errors.amount && (
                    <div className="text-red-500 text-sm">{formik.errors.amount}</div>
                )}
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
                <label className="flex gap-2 items-center text-gray-700 font-medium">
                    <FaWallet className="text-blue-500" />
                    <span>Category</span>
                </label>
                <select
                    {...formik.getFieldProps("category")}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                >
                    <option value="">Select category</option>
                    {categories?.map((category) => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                    <div className="text-red-500 text-sm">{formik.errors.category}</div>
                )}
            </div>

            {/* Date Input */}
            <div className="space-y-2">
                <label className="flex gap-2 items-center text-gray-700 font-medium">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>Date</span>
                </label>
                <input
                    type="date"
                    {...formik.getFieldProps("date")}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
                {formik.touched.date && formik.errors.date && (
                    <div className="text-red-500 text-sm">{formik.errors.date}</div>
                )}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
                <label className="flex gap-2 items-center text-gray-700 font-medium">
                    <FaRegCommentDots className="text-blue-500" />
                    <span>Description</span>
                </label>
                <textarea
                    {...formik.getFieldProps("description")}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                    placeholder="Enter description (optional)"
                    rows="3"
                />
                {formik.touched.description && formik.errors.description && (
                    <div className="text-red-500 text-sm">{formik.errors.description}</div>
                )}
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
                <label className="flex gap-2 items-center text-gray-700 font-medium">
                    <FaReceipt className="text-blue-500" />
                    <span>Receipt</span>
                </label>
                <input
                    type="file"
                    onChange={handleReceiptChange}
                    accept="image/*"
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
                {formik.touched.receipt && formik.errors.receipt && (
                    <div className="text-red-500 text-sm">{formik.errors.receipt}</div>
                )}
                {receiptPreview && (
                    <div className="mt-2">
                        <img
                            src={receiptPreview}
                            alt="Receipt preview"
                            className="max-w-full h-auto rounded-lg shadow-sm"
                            style={{ maxHeight: '200px' }}
                        />
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isPending}
                className={`w-full ${
                    isPending 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-700'
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200`}
            >
                {isPending ? 'Processing...' : (transactionId ? 'Update Transaction' : 'Add Transaction')}
            </button>
        </form>
    );
};

export default TransactionForm;
