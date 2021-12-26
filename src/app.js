const express = require("express");
const app = express();
const Router = require("../routes/router")

const port = process.env.PORT || 2013;

app.use(express.json())
app.use("/", Router)

app.listen(port, () => {
    console.log("connected to the server: ", port)
})