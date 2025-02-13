const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const crypto = require('crypto');
const { sendResetPasswordEmail } = require('../utils/emailService');

const User = require("../model/User");

const userController = {
    // Register
    register: asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;

        // Validate
        if (!username || !email || !password) {
            res.status(400);
            throw new Error("Please all fields are required");
        }

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400);
            throw new Error("User already exists");
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user and save in DB
        const userCreated = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        // Send the response
        res.json({
            username: userCreated.username,
            email: userCreated.email,
            id: userCreated._id,
        });
    }),

    // Login
    login: asyncHandler(async (req, res) => {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            res.status(400);
            throw new Error("Please provide email/username and password");
        }

        // Check if user exists with either email or username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        });

        if (!user) {
            res.status(401);
            throw new Error("Invalid credentials");
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401);
            throw new Error("Invalid credentials");
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.SECRET,
            { expiresIn: "3d" }
        );

        // Send response
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    }),

    // Profile
    profile: asyncHandler(async (req, res) => {
        // get user
        const user = await User.findById(req.user);

        if (!user) {
            throw new Error("User not found");
        }

        res.json({
            username: user.username,
            email: user.email,
        });
    }),

    // Change Password
    changePassword: asyncHandler(async (req, res) => {
        const { password, captcha } = req.body;

        // Verify reCAPTCHA
        try {
            const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`;
            const response = await axios.post(verifyURL);
            const data = response.data;

            if (!data.success) {
                res.status(400);
                throw new Error('reCAPTCHA verification failed');
            }
        } catch (error) {
            res.status(400);
            throw new Error('reCAPTCHA verification failed');
        }

        // Validate password
        if (!password) {
            res.status(400);
            throw new Error("Password is required");
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user's password
        const user = await User.findByIdAndUpdate(
            req.user,
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        res.json({
            status: "success",
            message: "Password updated successfully"
        });
    }),

    // Update User Profile
    updateUserProfile: asyncHandler(async (req, res) => {
        const { username, email } = req.body;

        // Validate input
        if (!username || !email) {
            res.status(400);
            throw new Error("Username and email are required");
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({ 
            email, 
            _id: { $ne: req.user } // exclude current user
        });
        
        if (existingUser) {
            res.status(400);
            throw new Error("Email is already taken");
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user,
            {
                username,
                email,
            },
            {
                new: true,
                runValidators: true // Run mongoose validators
            }
        );

        if (!updatedUser) {
            res.status(404);
            throw new Error("User not found");
        }

        res.json({
            message: "User Profile has been Updated successfully",
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
                id: updatedUser._id
            }
        });
    }),

    // Forgot Password
    forgotPassword: asyncHandler(async (req, res) => {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error("No account with that email exists");
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash token and set to resetPasswordToken field
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token and expiry
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        try {
            // Send email
            await sendResetPasswordEmail(user.email, resetToken);
            
            res.json({
                status: "success",
                message: "Password reset link sent to email"
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            res.status(500);
            throw new Error("Error sending email");
        }
    }),

    // Reset Password
    resetPassword: asyncHandler(async (req, res) => {
        const { token, password } = req.body;

        // Hash token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user by token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400);
            throw new Error("Invalid or expired reset token");
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({
            status: "success",
            message: "Password has been reset successfully"
        });
    }),
};

module.exports = userController;
