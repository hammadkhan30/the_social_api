const express = require("express");
const bodyparser = require("body-parser");
const md5 = require("md5")

const User = require("../models/user.js");
const router = express.Router();

router.use(bodyparser.json());

router
.post("/signup", (req,res)=>{
    const NewUser = new User({
        name : req.body.name,
        email : req.body.email,
        password : md5(req.body.password)
    });
    NewUser.save((err)=>{
        if (err) {
            res.status(500).json({message: "There was an error creating the user", error: err.message})
        }else{
            res.status(200).json({message : "Info added"})
        }
    })
})
router
.post("/login", (req,res)=> {
    const username = req.body.email;
    const password = md5(req.body.password);

    User.findOne({email : username}, (err, foundUser)=>{
        if (err) {
            res.json({message : "user not found"})
        }else{
            if (foundUser) {
                if (foundUser.password == password) {
                    res.json({message : "user found"})
                }
            }
        }
    })
})


module.exports = router;
