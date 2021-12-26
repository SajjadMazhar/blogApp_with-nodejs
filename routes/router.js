const express = require("express");
const router = express.Router();
const { userRegister, userLogin, writePost, likeDislikePostWithPostId, getLikeCountWithPostId, getDislikeCountWithPostId, userLogout } = require("../controllers/controller")
const { verifyToken } = require("../auth/authe");

router.post("/register", userRegister)

router.post("/login", userLogin)

router.post("/posts", verifyToken, writePost)

router.post("/post/:id/likedislike", verifyToken, likeDislikePostWithPostId)

router.get("/likes/:post_id", getLikeCountWithPostId)

router.get("/dislikes/:post_id", getDislikeCountWithPostId)

router.get("/logout", verifyToken, userLogout)


module.exports = router