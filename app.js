const express = require("express");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const 


const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

mongoose.connect("process.env.mongo_connection", {useNewUrlParser : true}, ()=>{
    console.log("Database connected");
})

app.get("/", (_req,res)=>{
    res.send("Welcome");
})

app.listen(port, ()=>{
    console.log(`Server up and running ${port}`);
})