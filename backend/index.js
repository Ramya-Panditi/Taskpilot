    const express = require("express");
    const app = express();
    const bodyParser = require("body-parser");
    const cors = require("cors");
    const route = require("./controller/tasksRoute");

    const mongoose = require("mongoose");
    mongoose.set("strictQuery",true);
    mongoose.connect("mongodb+srv://ramyapanditi:12345@cluster0.rv0giqd.mongodb.net/");
    const db = mongoose.connection;
    db.on("open",()=> console.log("database connected"));
    db.on("error",() => console.log("error"));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    
    app.use("/",route);
    app.use(cors({
        origin: ["https://taskpilot-chi.vercel.app","https://taskpilot-5z61.vercel.app"],
        methods: ["POST", "GET", "PUT", "DELETE"],
      }));
    app.options("*", cors());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "https://taskpilot-5z61.vercel.app");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });
    

    app.listen(4000,()=>{
        console.log("Running on 4000");
    })