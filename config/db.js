require("dotenv").config()

const knex = require("knex")({
    client:"mysql",
    connection:{
        host:"localhost",
        user:"root",
        password:"Sajj@d007",
        database:"blogsdb",
        multipleStatements:true
    }
})

knex.schema.createTable("userDetails", t=>{
    t.increments("id")
    t.string("name")
    t.string("email")
    t.string("password")
}).then(()=>{
    console.log("user table created")
}).catch(err=>{
    console.log("userData error: " ,err.sqlMessage)
})

knex.schema.createTable("post", t=>{
    t.increments("id")
    t.string("unique_id")
    t.string("title")
    t.string("content")
    t.date("date")

}).then(()=>{
    console.log("post data created")
}).catch(err=>{
    console.log("post table error: ", err.sqlMessage)
})

knex.schema.createTable("likeDislikeStorage", t=>{
    t.increments("id")
    t.string("unique_id")
    t.integer("post_id")
    t.boolean("like")
    t.boolean("dislike")
}).then(()=>{
    console.log("likeDislike table created")
}).catch(err =>{
    console.log("likedislike error: ", err.sqlMessage)
})

module.exports= knex;