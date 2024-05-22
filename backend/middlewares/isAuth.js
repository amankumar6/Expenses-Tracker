const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    // get token
    const headerObj = req.headers;
    const token = headerObj?.authorization;

    //verify token
    const decodedToken = jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return false;
        } else {
            return decoded;
        }
    });

    if (decodedToken) {
        req.user = decodedToken.id;
        next();
    } else {
        const err = new Error("Token expired, login again");
        next(err);
    }

}

module.exports = isAuthenticated;