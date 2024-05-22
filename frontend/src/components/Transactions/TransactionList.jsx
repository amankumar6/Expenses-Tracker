import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import {
    deleteTransactionAPI,
    getTransactionsAPI,
} from "../../services/transactionServices";
import { fetchingCategoryAPI } from "../../services/categoryServices";

const TransactionList = ({ filters, setFilters }) => {
    // Filters for transaction

    const handleFilterChanges = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Mutation for fetching transaction
    const { data: transactions, refetch } = useQuery({
        queryFn: () => getTransactionsAPI(filters),
        queryKey: ["getTransactions", filters],
    });

    // for fetching category
    const { data: categories } = useQuery({
        queryFn: fetchingCategoryAPI,
        queryKey: ["listCategories"],
    });

    const { mutateAsync: muatateAsyncDelete } = useMutation({
        mutationFn: deleteTransactionAPI,
        mutationKey: ["deleteTransaction"],
    });

    const handleDelete = (id) => {
        muatateAsyncDelete(id)
            .then((data) => {
                refetch();
            })
            .catch((e) => console.log(e));
    };

    return (
        <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Start Date */}
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChanges}
                    className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {/* End Date */}
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChanges}
                    className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {/* Type */}
                <div className="relative">
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChanges}
                        className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                {/* Category */}
                <div className="relative">
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChanges}
                        className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
                    >
                        <option value="All">All Categories</option>
                        <option value="Uncategorized">Uncategorized</option>
                        {categories?.map((category) => {
                            return (
                                <option
                                    key={category?._id}
                                    value={category?.name}
                                >
                                    {category?.name}
                                </option>
                            );
                        })}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>
            <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
                {/* Inputs and selects for filtering (unchanged) */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Filtered Transactions
                    </h3>
                    <ul className="divide-y divide-gray-200">
                        {transactions?.map((transaction) => (
                            <li
                                key={transaction._id}
                                className="py-4 flex justify-between items-center hover:bg-gray-100 transition-all duration-300 ease-in-out"
                            >
                                <div>
                                    <span className="font-medium text-gray-600">
                                        {new Date(
                                            transaction.date
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </span>
                                    <span
                                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            transaction.type === "income"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {transaction.type
                                            .charAt(0)
                                            .toUpperCase() +
                                            transaction.type.slice(1)}
                                    </span>
                                    <span className="ml-2 text-gray-800">
                                        {transaction.category?.name} $
                                        {transaction.amount.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-600 italic ml-2">
                                        {transaction.description}
                                    </span>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        to={`/update-transaction/${transaction._id}`}
                                        className="text-blue-500 hover:text-blue-700 transition-all duration-300 ease-in-out"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(transaction._id)
                                        }
                                        className="text-red-500 hover:text-red-700 transition-all duration-300 ease-in-out"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TransactionList;
