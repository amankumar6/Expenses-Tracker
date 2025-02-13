const asyncHandler = require("express-async-handler");
const { uploadReceipt, deleteReceipt } = require("../utils/azureStorage");
const Transaction = require("../model/Transaction");

const transactionController = {
    // Creating Transaction
    create: asyncHandler(async (req, res) => {
        try {
            const {
                type,
                category,
                amount,
                date,
                description
            } = req.body;

            // Validate required fields
            if (!amount || !type || !date) {
                res.status(400);
                throw new Error("Type, amount and date are required!");
            }

            // Validate amount is a number
            const numericAmount = Number(amount);
            if (isNaN(numericAmount)) {
                res.status(400);
                throw new Error("Amount must be a valid number");
            }

            // Handle receipt upload if present (optional)
            let receiptUrl = null;
            if (req.file) {
                try {
                    receiptUrl = await uploadReceipt(req.file);
                } catch (error) {
                    console.error('Error uploading receipt:', error);
                    res.status(500);
                    throw new Error(`Failed to upload receipt: ${error.message}`);
                }
            }

            const transaction = await Transaction.create({
                user: req.user,
                type,
                category,
                amount: numericAmount,
                date,
                description,
                receiptUrl
            });

            res.status(201).json({
                status: "success",
                message: "Transaction created successfully",
                transaction,
            });
        } catch (error) {
            // If there was an error and we uploaded a receipt, clean it up
            if (error && req.file && receiptUrl) {
                try {
                    await deleteReceipt(receiptUrl);
                } catch (cleanupError) {
                    console.error('Error cleaning up receipt after failed transaction:', cleanupError);
                }
            }
            throw error;
        }
    }),

    // Reading Transaction
    getFilteredTransactions: asyncHandler(async (req, res) => {
        try {
            const { startDate, endDate, type, category, id } = req.query;

            // If specific transaction ID is requested
            if (id) {
                const transaction = await Transaction.findById(id);
                if (!transaction) {
                    res.status(404);
                    throw new Error("Transaction not found");
                }
                return res.json(transaction);
            }

            // Build filter object
            const filters = { user: req.user };

            if (type) {
                filters.type = type;
            }

            if (category) {
                filters.category = category;
            }

            // Add date range filter if either startDate or endDate is provided
            if (startDate || endDate) {
                filters.date = {};
                if (startDate) {
                    filters.date.$gte = new Date(startDate);
                }
                if (endDate) {
                    filters.date.$lte = new Date(endDate);
                }
            }

            const transactions = await Transaction.find(filters)
                .sort({ date: -1 }) // Sort by date descending
                .lean(); // Convert to plain JavaScript objects

            res.json(transactions);
        } catch (error) {
            console.error('Error in getFilteredTransactions:', error);
            throw error;
        }
    }),

    // Update Transaction
    updateTransaction: asyncHandler(async (req, res) => {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            res.status(404);
            throw new Error("Transaction not found");
        }

        // Verify ownership
        if (transaction.user.toString() !== req.user.toString()) {
            res.status(403);
            throw new Error("Not authorized to update this transaction");
        }

        // Update fields
        const updates = { ...req.body };
        
        // Convert amount to number if present
        if (updates.amount) {
            const numericAmount = Number(updates.amount);
            if (isNaN(numericAmount)) {
                res.status(400);
                throw new Error("Amount must be a valid number");
            }
            updates.amount = numericAmount;
        }

        // Handle receipt upload if present
        if (req.file) {
            try {
                // Delete old receipt if exists
                if (transaction.receiptUrl) {
                    await deleteReceipt(transaction.receiptUrl);
                }
                updates.receiptUrl = await uploadReceipt(req.file);
            } catch (error) {
                console.error('Error handling receipt:', error);
                res.status(500);
                throw new Error(`Failed to handle receipt: ${error.message}`);
            }
        }

        // Update transaction
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            status: "success",
            message: "Transaction updated successfully",
            transaction: updatedTransaction,
        });
    }),

    // Delete Transaction
    deleteTransaction: asyncHandler(async (req, res) => {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            res.status(404);
            throw new Error("Transaction not found");
        }

        // Verify ownership
        if (transaction.user.toString() !== req.user.toString()) {
            res.status(403);
            throw new Error("Not authorized to delete this transaction");
        }

        // Delete receipt if exists
        if (transaction.receiptUrl) {
            try {
                await deleteReceipt(transaction.receiptUrl);
            } catch (error) {
                console.error('Error deleting receipt:', error);
            }
        }

        await transaction.deleteOne();
        res.json({ message: "Transaction deleted successfully" });
    }),
};

module.exports = transactionController;