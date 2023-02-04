const { verify } = require('jsonwebtoken');

exports.isAuth = async (req, res, next) => {
    // get token from header
    const token = req.header('token');

    if (!token) {
        return next(new Error('Authorization failed!'));
    }

    verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            next(new Error("Invalid Token"))
        }
        else {
            console.log("decoded: ", decoded);
            req.user = { ...decoded };
            next();
        }
    });
}
