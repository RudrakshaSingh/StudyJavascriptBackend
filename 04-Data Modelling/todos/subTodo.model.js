import mongoose from "mongoose";

const subTodoSchema=new mongoose.Schema({
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
    }
},{timestamps:true})

export const SubTodo=mongoose.model("SubTodo",subTodoSchema)