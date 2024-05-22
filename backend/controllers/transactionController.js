const asyncHandler = require("express-async-handler");

const Transaction = require("../model/Transaction");

const transactionController = {
    // Creating Transaction
    create: asyncHandler(async (req, res) => {
        const {
            type,
            category,
            amount,
            date,
            description
        } = req.body;

        if (!amount || !type || !date) {
            throw new Error("Type, amount and date are required!!");
        }

        const transaction = await Transaction.create({
            user: req.user,
            type,
            category,
            amount,
            date,
            description,
        });

        res.status(201).json(transaction);
    }),

    // Reading Transaction
    getFilteredTransactions: asyncHandler(async (req, res) => {
        const {
            startDate,
            endDate,
            type,
            category,
            id
        } = req.query;
    
        if (id) {
            const transaction = await Transaction.findById(id);
            if (!transaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }
            return res.status(200).json(transaction);
        }

        let filters = {
            user: req.user,
        };

        if (startDate) {
            filters.date = {
                ...filters.date,
                $gte: new Date(startDate),
            };
        }

        if (endDate) {
            filters.date = {
                ...filters.date,
                $lte: new Date(endDate),
            };
        }

        if (type) {
            filters.type = type;
        }

        if (category) {
            if (category === "All") {} else if (category === "Uncategorized") {
                filters.category = "Uncategorized";
            } else {
                filters.category = category;
            }
        }

        const transactions = await Transaction.find(filters).sort({
            date: -1,
        });

        res.json(transactions);
    }),

    // Update Transaction
    updateTransaction: asyncHandler(async (req, res) => {
        // Find the transaction
        const transaction = await Transaction.findById(req.params.id);

        if (transaction && transaction.user.toString() == req.user.toString()) {
            transaction.type = req.body.type || transaction.type;
            transaction.category = req.body.category || transaction.category;
            transaction.amount = req.body.amount || transaction.amount;
            transaction.date = req.body.date || transaction.date;
            transaction.description = req.body.description || transaction.description;

            const updatedTransaction = await transaction.save();
            res.json(updatedTransaction);
        }
    }),

    // Delete Transaction
    deleteTransaction: asyncHandler(async (req, res) => {
        const transaction = await Transaction.findById(req.params.id);

        if (transaction && transaction.user.toString() == req.user.toString()) {
            await Transaction.findByIdAndDelete(req.params.id);
            res.json({
                message: "Transaction Removed"
            });
        }
    }),
};

module.exports = transactionController;