/* eslint-disable no-undef */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Task = require("./Models/Task");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
//default
app.get("/", (req, res) => {
  res.send("Employee Task Management API is running");
});
//post->/api/tasks
console.log(Task);
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    if (!title || !description || !priority || !status || !dueDate) {
      res.send("all fields required");
      return;
    }
    // Save the document to the MongoDB database

    const savedTask = await Task.create(
      {
        title,
        description,
        priority,
        status,
        dueDate
      });
    // Return the saved document with a 201 (Created) status code

    res.status(201).json(savedTask);
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }


})

//get->api/tasks ->all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    //mongoose doesnt use findall() method,it uses find()
    const allTasks = await Task.find()
    return res.status(200).json(allTasks);

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
})

//get task by id ->/api/tasks/:id
app.get("/api/tasks/:id",async (req,res)=>{
  try{
    const taskId = req.params.id;
  if(!taskId){
    return res.status(400).send("Task Id is not present ");
  }
  const foundTask = await Task.findById(taskId);
  return res.status(200).json(foundTask);

  }catch(err){
   return res.status(400).json({message:err.message});
  }
   

}) 
//patch task by id ->/api/tasks/:id
app.patch("/api/tasks/:id",async (req,res)=>{
  try{
    
  const taskId = req.params.id;
  
  const updateTask = await Task.findByIdAndUpdate(taskId,req.body,{
   new :true,
   runValidators:true
  })
  if(!updateTask){
    return res.status(404).json({message:"Task not found"});
  }
  return res.status(200).json(updateTask);

  }catch(error){
    return res.status(400).json({message:error.message});
  }
})


//put ->/api/tasks/:id
app.put("/api/tasks/:id",async (req,res)=>{
  
  try{
    const { title, description, priority, status, dueDate } = req.body;

    
  const taskId = req.params.id;
  
  const updateTask = await Task.findByIdAndUpdate(taskId,
   {title,
     description, 
     priority, 
     status, 
     dueDate} ,
     {
   returnDocument :"after",
   runValidators:true
  })
  if(!updateTask){
    return res.status(404).json({message:"Task not found"});
  }
  return res.status(200).json(updateTask);

  }catch(error){
    return res.status(400).json({message:error.message});
  }
})

//delete ->api/tasks/:id
app.delete("/api/tasks/:id",async(req,res)=>{
  try{
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if(!deletedTask){
      return res.status(404).json({message:"Task Not FOUND"})
    }
    return res.json(deletedTask);

  }catch(error){
      return res.status(400).json({message:error.message});

  }
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});