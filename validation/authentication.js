const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
const router = express.Router();


router.post("/signup", (req,res)=>{
    const NewUser = new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    });
    NewUser.save((err)=>{
        if (err) {
            console.log(err);
        }else{
            console.log();
        }
    })
})

module.exports = app;
