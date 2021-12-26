const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.createAccessToken = (user) => {
    return jwt.sign(user, process.env.SECRET_TOKEN);
}

exports.verifyToken = (req, res, next) => {
    if (req.headers.cookie == undefined) {
        console.log("token is missing")
        res.send("token has expired")
    }
    const token = req.headers.cookie.split("=")[1]
    jwt.verify(token, process.env.SECRET_TOKEN, (err, data) => {
        if (err) {
            console.log("token has expired")
            res.send({ status: `token expired: ${err}` })
        }
        req.data = data;
        next();
    })
}