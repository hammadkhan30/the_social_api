const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");

const User = require("../models/user.js");
const router = express.Router();

const saltRounds = 10;

router.use(bodyparser.json());

router
.post("/signup", (req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const NewUser = new User({
            name : req.body.name,
            email : req.body.email,
            password : hash
        });
        NewUser.save((err)=>{
            if (err) {
                res.status(500).json({message: "There was an error creating the user", error: err.message})
            }else{
                res.status(200).json({message : "Info added"})
            }
        })
    });
})
router
.post("/login", (req,res)=> {
    const username = req.body.email;
    const password = req.body.password;

    User.findOne({email : username}, (err, foundUser)=>{
        if (err) {
            res.status(404).json({message : "user not found"})
        }else{
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result == true) {
                        res.status(401).json({message : "user found"});    
                    }else{
                        res.status(404).json({message : "wrong password"});
                    }
                });
            }
        }
    })
})


module.exports = router;
