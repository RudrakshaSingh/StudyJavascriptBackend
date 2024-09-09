import mongoose from "mongoose";

const todoSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        default:false
    },
    createdBy:{//to make a relation with user database
        type:mongoose.Schema.Types.ObjectId,//after this need to give reference in next line
        ref:"User"
    },
    //array of subtodos
    subTodos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubTodo"
    }]
},{timestamps:true})

export const Todo=mongoose.model("Todo",todoSchema)