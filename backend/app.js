const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { initializeContainer } = require("./utils/azureStorage");
require("dotenv").config({ path: ".env" });

const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const errorHandler = require("./middlewares/errorHandlers");
const transactionRouter = require("./routes/transactionRouter");

const app = express();

// MongoDb connection
mongoose
    .connect(process.env.DATABASE)
    .then(() => console.log("DB Connected"))
    .catch((e) => console.log(e));

// Initialize Azure Storage container
initializeContainer().catch(console.error);

// CORS config
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [process.env.FRONTEND_DEV, process.env.FRONTEND_URL];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));

// Additional security headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.json());

// Router
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/transaction", transactionRouter);

// Error Handling
app.use(errorHandler.notFound);

if (app.get("env") === "DEVELOPMENT") {
    app.use(errorHandler.developmentErrors);
}

app.use(errorHandler.productionErrors);

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
