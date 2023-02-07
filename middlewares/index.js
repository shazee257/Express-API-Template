const { verify } = require('jsonwebtoken');

// exports.isAuth = async (req, res, next) => {
//     // get token from header
//     const token = req.header('token');
//     if (!token) {
//         return next(new Error('Authorization failed!'));
//     }

//     verify(token, process.env.JWT_SECRET, function (err, decoded) {
//         if (err) {
//             next(new Error("Invalid Token"))
//         }
//         else {
//             req.user = { ...decoded };
//             next();
//         }
//     });
// }

exports.isAuth = async (req, res, next) => {
    // get token from cookie-session
    const token = req.session.token;
    if (!token) {
        return next(new Error('Authorization failed!'));
    }

    verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            next(new Error("Invalid Token"))
        }
        else {
            req.user = { ...decoded };
            next();
        }
    });
}