const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
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

// CORS config
const corsOptions = {
    origin: [process.env.FRONT_END],
};

// Middleware
app.use(cors(corsOptions));
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
