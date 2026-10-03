/* eslint-disable no-undef */

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        required:true,
        enum: ["Low", "Medium", "High"]
    },
    status:{
        type:String,
        required:true,
        enum:["Pending","In Progress","Completed"]
    },
    dueDate:{
        type:Date,
        required:true
    }
})
module.exports = mongoose.model("Task",taskSchema);