const express = require("express");
const dotenv = require("dotenv")


const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.get("/", (_req,res)=>{
    res.send("Welcome");
})

app.listen(port, ()=>{
    console.log(`Server up and running ${port}`);
})