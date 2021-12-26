const express = require("express");
const app = express();
const knex = require("../config/db")
const {createAccessToken, verifyToken} = require("../auth/authe");

const port = 2013;
app.use(express.json())

// register login
app.post("/register", async(req, res)=>{

    const data2 = await req.body
        knex("userDetails").where({email: data2.email, password: data2.password}).then(data=>{
            if(data.length==0){
                knex("userDetails").insert(data2).then(()=>{
                    console.log("signed up")
                    res.send("signed up successfully")
                }).catch(err =>{
                    console.log("error while signing up", err)
                    res.send("some error occured")
                })
            }else{
                console.log("user already exists")
                res.send("duplicate entry")
            }
        }).catch(err=>{
            console.log("error while searching user", err)
            res.send("some error occured")
        })
})

app.post("/login", (req, res)=>{
    knex("userDetails").where({email:req.body.email, password:req.body.password}).then(data=>{
        if(data[0].email==req.body.email && data[0].password==req.body.password){
            const token = createAccessToken(data[0].id);
            res.cookie("token", token).send("login successful")
        }else{
            res.send("invalid email or password")
        }
    }).catch(err=>{
        res.send("error while logging in: ", err)
    })
})

// creating posts

app.post("/posts", verifyToken, (req, res)=>{
    knex("userDetails")
    const userData = {
        unique_id: req.data,
        title: req.body.title,
        content:req.body.content,
        date: new Date()
    }

    knex("post").insert(userData).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
        res.send("error while posting post")
    })
})

app.post("/post/:id/likedislike", verifyToken, (req, res)=>{
    
    knex("post").where({id:req.params.id}).then(data=>{
        if(data[0]){
            let likeDisliked = req.body.like;
            let postStatus
            likeDisliked ? postStatus="liked" : postStatus="disliked";
            knex("likeDislikeStorage").where({unique_id:req.data, post_id:req.params.id}).then(presentData=>{
                if(!presentData){
                    knex("likeDislikeStorage").insert({
                        unique_id:req.data,
                        post_id:req.params.id,
                        like:req.body.like || false,
                        dislike:req.body.dislike || false
                    }).then(()=>{
                        res.send(`post ${postStatus}`)
                    }).catch(err=>{
                        console.log("error: ", err.sqlMessage)
                        res.send("error while liking the post")
                    })
                }else{
                    res.send("You already reacted to this")
                }
            }).catch(err=>{
                res.send("error while searching likeDislike")
            })
        }
    })


})

app.get("/getLikes", (req, res)=>{
    knex("likeDislikeStorage").where({like:true}).then(data=>{
        res.send({allLikes:data.length})
    }).catch(err=>{
        res.send("error while getting likes count: ", err)
    })
})

app.get("/getDislikes", (req, res)=>{
    knex("likeDislikeStorage").where({dislike:true}).then(data=>{
        res.send({allDislikes:data.length})
    })
})

app.get("/logout", verifyToken, async (req, res)=>{
    try {
        console.log("loggged out")
        res.clearCookie("token").send("logged out successfully")
    } catch (error) {
        res.send(error)
    }
})


app.listen(port, ()=>{
    console.log("connected to the server: ", port)
})