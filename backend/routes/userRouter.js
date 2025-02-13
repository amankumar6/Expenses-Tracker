const express = require("express");
const isAuthenticated = require("../middlewares/isAuth");
const userController = require("../controllers/userController");

const userRouter = express.Router();

// Register
userRouter.post("/register", userController.register);

// Login
userRouter.post("/login", userController.login);

// Profile
userRouter.get("/profile", isAuthenticated, userController.profile);

// Change Password
userRouter.put(
    "/changePassword",
    isAuthenticated,
    userController.changePassword
);

// Update Profile
userRouter.put(
    "/updateProfile",
    isAuthenticated,
    userController.updateUserProfile
);

// Forgot Password
userRouter.post("/forgot-password", userController.forgotPassword);

// Reset Password
userRouter.post("/reset-password", userController.resetPassword);

module.exports = userRouter;
