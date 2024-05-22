const express = require("express");
const isAuthenticated = require("../middlewares/isAuth");
const transactionController = require("../controllers/transactionController");

const transactionRouter = express.Router();

// Creating
transactionRouter.post(
    "/create",
    isAuthenticated,
    transactionController.create
);

// Reading
transactionRouter.get(
    "/lists",
    isAuthenticated,
    transactionController.getFilteredTransactions
);

// Updating
transactionRouter.put(
    "/update/:id",
    isAuthenticated,
    transactionController.updateTransaction
);

// Deleting
transactionRouter.delete(
    "/delete/:id",
    isAuthenticated,
    transactionController.deleteTransaction
);

module.exports = transactionRouter;