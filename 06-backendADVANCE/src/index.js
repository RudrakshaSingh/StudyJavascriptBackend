import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({path:"./env"})

connectDB()














/*
import mongoone from "mongoose";
import {DB_NAME} from "./constants.js"

import express from "express"

const app = express()

//IIFE-semicolon for c;leaning puposes for previous lines
;(async ()=>{
    try{
        await mongoone.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log("database connected")

        //listners,part of express.if express not able to communicate even after connecting to db
        app.on("error", (error)=>{
            console.log("ERRR: ",error);
            throw error
            
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })

    }
    catch(error){
        //can also do console.log
        console.error("ERROR: ", error)
        throw err
    }
})()
*/