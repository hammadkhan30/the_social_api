const express = require("express");
const bodyparser = require("body-parser");
const User = require("../models/user.js");
const router = express.Router();

router.use(bodyparser.json());

router
.post("/signup", (req,res)=>{
    const NewUser = new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    });
    NewUser.save((err)=>{
        if (err) {
            res.status(500).json({message: "There was an error creating the user", error: err.message})
        }else{
            res.status(200).json({message : "Info added"})
        }
    })
})
.get("/signup", (req,res)=>{
    res.json("message : chal raha hai ye to")
})

module.exports = router;
