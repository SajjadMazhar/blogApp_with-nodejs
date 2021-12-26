const { createAccessToken } = require("../auth/authe");
const knex = require("../config/db")
const joi = require("joi")


exports.userRegister = async (req, res) => {
    const Schema = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().min(5).max(50),
        password: joi.string().min(8).max(16).required()
    })
    let validateSchema = Schema.validate(req.body);
    if (validateSchema.error) {
        res.status(400).json({
            message: validateSchema.error.message || "error while validation"
        })
    } else {
        const data2 = await req.body
        knex("userDetails").where({ email: data2.email, password: data2.password }).then(data => {
            if (data.length == 0) {
                knex("userDetails").insert(data2).then(() => {
                    console.log("signed up")
                    res.status(201).send("signed up successfully")
                }).catch(err => {
                    console.log("error while signing up", err)
                    res.send("some error occured")
                })
            } else {
                console.log("user already exists")
                res.send("duplicate entry")
            }
        }).catch(err => {
            console.log("error while searching user", err)
            res.send("some error occured")
        })
    }
}

exports.userLogin = (req, res) => {
    knex("userDetails").where({ email: req.body.email, password: req.body.password }).then(data => {
        if (data[0].email == req.body.email && data[0].password == req.body.password) {
            const token = createAccessToken(data[0].id);
            res.cookie("token", token).send("login successful")
        } else {
            res.status(401).send("invalid email or password")
        }
    }).catch(err => {
        res.send("User is not registered yet: ", err)
    })
}

exports.writePost = (req, res) => {
    knex("userDetails")
    const userData = {
        unique_id: req.data,
        title: req.body.title,
        content: req.body.content,
        date: new Date()
    }

    knex("post").insert(userData).then(data => {
        res.status(201).send(data)
    }).catch(err => {
        console.log(err)
        res.send("error while posting post")
    })
}

exports.likeDislikePostWithPostId = (req, res) => {

    knex("post").where({ id: req.params.id }).then(data => {
        if (data[0]) {
            let likeDisliked = req.body.like;
            let postStatus
            likeDisliked ? postStatus = "liked" : postStatus = "disliked";
            knex("likeDislikeStorage").where({ unique_id: req.data, post_id: req.params.id }).then(presentData => {
                if ((presentData.like == false && presentData.dislike == false) || presentData.length == 0) {
                    knex("likeDislikeStorage").insert({
                        unique_id: req.data,
                        post_id: req.params.id,
                        like: req.body.like || false,
                        dislike: req.body.dislike || false
                    }).then(() => {
                        res.status(201).send(`post ${postStatus}`)
                    }).catch(err => {
                        console.log("error: ", err.sqlMessage)
                        res.send("error while liking the post")
                    })
                } else {
                    res.send("You already reacted to this")
                }
            }).catch(() => {
                res.send("error while searching likeDislike")
            })
        }
    })
}

exports.getLikeCountWithPostId = (req, res) => {
    knex("likeDislikeStorage").where({ post_id: req.params.post_id, like: true }).then(data => {
        res.status(200).send({ likes: data.length })
    }).catch(err => {
        res.status(404).send(`post not found: ${err}`)
    })
}

exports.getDislikeCountWithPostId = (req, res) => {
    knex("likeDislikeStorage").where({ post_id: req.params.post_id, dislike: true }).then(data => {
        res.status(200).send({ dislikes: data.length })
    }).catch(err => {
        res.status(404).send(`post not found: ${err}`)
    })
}

exports.userLogout = (req, res) => {
    res.clearCookie("token").status(200).send("logged out successfully")
}