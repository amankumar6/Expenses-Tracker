const multer = require('multer');

exports.errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Handle Multer errors
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: err.code === 'LIMIT_FILE_SIZE' 
                ? 'File is too large. Maximum size is 5MB'
                : err.message
        });
    }

    // Handle Azure Storage errors
    if (err.message && err.message.includes('Azure Storage')) {
        console.error('Azure Storage Error:', err);
        return res.status(500).json({
            message: 'Error processing file upload. Please try again later.'
        });
    }

    // Handle other errors
    res.status(statusCode).json({
        message: err?.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "DEVELOPMENT" ? err?.stack : null,
    });
};

exports.notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    res.status(err.status);
    res.json({
        message: `${req.url} ${err.message}`,
    });
};

exports.developmentErrors = (err, req, res) => {
    err.stack = err.stack || '';
    const errorDetails = {
        message: err.message,
        status: err.status,
        stackHighlighted: err.stack.replace(
            /[a-z_-\d]+.js:\d+:\d+/gi,
            '<mark>$&</mark>'
        ),
    };
    res.status(err.status || 500);
    res.json(errorDetails);
};

exports.productionErrors = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        error: {},
    });
};