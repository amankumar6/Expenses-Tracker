const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        // get user data
        const { email, password } = req.body;

        // if email is correct
        const user = await User.findOne({ email });

        // if no user
        if (!user) {
            res.status(401);
            throw new Error("Invalid login credentials");
        }

        // compare password
        const ifPasswordMatch = await bcrypt.compare(password, user?.password);
        if (!ifPasswordMatch) {
            res.status(401);
            throw new Error("Invalid login credentials");
        }

        // generate token
        const token = jwt.sign(
            {
                id: user?._id,
            },
            process.env.SECRET,
            {
                expiresIn: "21d",
            }
        );

        res.json({
            message: "Login Successful",
            token,
            id: user._id,
            username: user.username,
            email: user.email,
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

    // Change password
    changeUserPassword: asyncHandler(async (req, res) => {
        const { newPassword } = req.body;

        const user = await User.findById(req.user);

        if (!user) {
            throw new Error("User not found");
        }

        // Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        //ReSave
        await user.save({});

        res.json({
            message: "Your Password has been Changed successfully",
        });
    }),

    // Update User Profile
    updateUserProfile: asyncHandler(async (req, res) => {
        const { username, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user,
            {
                username,
                email,
            },
            {
                new: true,
            }
        );

        res.json({
            message: "User Profile has been Updated successfully",
            updatedUser,
        });
    }),
};

module.exports = userController;
