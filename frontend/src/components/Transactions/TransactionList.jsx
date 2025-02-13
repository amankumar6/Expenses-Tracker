import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import {
    deleteTransactionAPI,
    fetchTransactionsAPI,
} from "../../services/transactionServices";
import { fetchingCategoryAPI } from "../../services/categoryServices";

const TransactionList = ({ filters, setFilters }) => {
    // Fetch transactions
    const { data: transactions, refetch } = useQuery({
        queryKey: ["transactions", filters],
        queryFn: () => fetchTransactionsAPI(filters),
        enabled: true // Always fetch when filters change
    });

    // Fetch categories
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchingCategoryAPI
    });

    // Delete transaction mutation
    const { mutateAsync: deleteTransaction } = useMutation({
        mutationFn: deleteTransactionAPI,
        onSuccess: () => {
            refetch(); // Refresh the list after deletion
        }
    });

    // Handle filter changes
    const handleFilterChanges = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    return (
        <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Start Date */}
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate || ''}
                    onChange={handleFilterChanges}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                />

                {/* End Date */}
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate || ''}
                    onChange={handleFilterChanges}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                />

                {/* Type Filter */}
                <select
                    name="type"
                    value={filters.type || ''}
                    onChange={handleFilterChanges}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                {/* Category Filter */}
                <select
                    name="category"
                    value={filters.category || ''}
                    onChange={handleFilterChanges}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                >
                    <option value="">All Categories</option>
                    {categories?.map((category) => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Transactions List */}
            <div className="mt-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Receipt
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions?.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            transaction.type === "income"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {transaction.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${transaction.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {transaction.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {transaction.receiptUrl && (
                                            <a
                                                href={transaction.receiptUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                View Receipt
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Link
                                            to={`/update-transaction/${transaction._id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <FaEdit className="inline" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(transaction._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FaTrash className="inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionList;
