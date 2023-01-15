const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")


const cont = require("./controller/authentication.js")

const app = express(express.json());
const port = process.env.PORT || 3000;

//dotenv.config();

mongoose.connect(process.env.mongo,
 { 
     useNewUrlParser: true,
     //useUnifiedTopology: true, 
})
.then(() => {
    console.log('Connected to MongoDB')
})
.catch((err) => {
    console.log('Failed to connect to MongoDB', err)
});


app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use("/user",cont);

app.get("/", (_req,res)=>{
    res.json({message : 'welcome'});
})

app.listen(port, (err)=>{
    if (err) {
        console.log(err);
    }
    console.log(`Server up and running ${port}`);
})