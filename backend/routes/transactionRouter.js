const express = require("express");
const isAuthenticated = require("../middlewares/isAuth");
const { upload, handleMulterError } = require("../middlewares/uploadMiddleware");
const transactionController = require("../controllers/transactionController");

const transactionRouter = express.Router();

// Creating Transaction (with optional receipt upload)
transactionRouter.post(
    "/create",
    isAuthenticated,
    upload.single('receipt'),
    handleMulterError,
    transactionController.create
);

// Reading Transaction
transactionRouter.get(
    "/lists",
    isAuthenticated,
    transactionController.getFilteredTransactions
);

// Updating Transaction
transactionRouter.put(
    "/update/:id",
    isAuthenticated,
    upload.single('receipt'),
    handleMulterError,
    transactionController.updateTransaction
);

// Deleting Transaction
transactionRouter.delete(
    "/delete/:id",
    isAuthenticated,
    transactionController.deleteTransaction
);

module.exports = transactionRouter;