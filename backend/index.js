const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const route = require("./controller/tasksRoute");

const mongoose = require("mongoose");
mongoose.set("strictQuery",true);
mongoose.connect("mongodb+srv://ramyapanditi:12345@cluster0.rv0giqd.mongodb.net/")
const db = mongoose.connection;
db.on("open",()=> console.log("database connected"));
db.on("error",() => console.log("error"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());


app.use("/",route);

app.listen(4000,()=>{
    console.log("Running on 4000");
})