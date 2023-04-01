require('dotenv').config();

const app = require('./app');

const Port = 4000;

app.listen(Port,()=>{
    console.log("server up and running");
})