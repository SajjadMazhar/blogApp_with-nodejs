const jwt = require("jsonwebtoken")
require("dotenv").config()
let SECRET_TOKEN="b97b29e9820e8f09ca8c607eb0752e1954b58741a75daef948e19cfe184b7b2dacae61c1e643e474cc5566497ef75713eeb0c8f137aaf81bbc7de5e8efc6b0cb"

exports.createAccessToken = (user)=>{
    return jwt.sign(user, SECRET_TOKEN);
}

exports.verifyToken = (req, res, next)=>{
    if(req.headers.cookie == undefined){
        console.log("token is missing")
        res.send("token has expired")
    }
    const token = req.headers.cookie.split("=")[1]
    jwt.verify(token, SECRET_TOKEN, (err, data)=>{
        if(err){
            console.log("token has expired")
            res.send({status:`token expired: ${err}`})
        }
        req.data = data;
        next();
    })
}