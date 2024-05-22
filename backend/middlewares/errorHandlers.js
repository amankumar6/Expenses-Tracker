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