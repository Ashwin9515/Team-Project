import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5000;
 
app.use(cors());
app.use(express.json());
 
// MongoDB Connection
mongoose
  .connect(`${process.env.MONGO_URI}/Study_Planner`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
 
// Task Schema
const TaskSchema = new mongoose.Schema({
  task: String,
  subject: String,
  desc: String,
  startdate: Date,
  deadline: Date,
  completed: Boolean,
  percentComp: Number,
});
const Task = mongoose.model("Task", TaskSchema, "tasks");
 
// Profile Schema
const ProfileSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});
const Profile = mongoose.model("Profile", ProfileSchema, "profiles");
 
// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});
 
// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json({ message: "Task added", task });
  } catch (error) {
    res.status(500).json({ error: "Error adding task" });
  }
});
 
// Edit a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
});
 
// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});
 
// Get all profiles
app.get("/api/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
 
// Chat API
app.post("/api/chat", async (req, res) => {
  const message = req.body["content"];
  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }
 
  try {
    const context = "Hi";
    const augmentedPrompt = `Context:\n${context}\n\nUser: ${message}\nBot:`;
 
    const axiosResponse = await axios({
      method: "post",
      url: "http://localhost:11434/api/generate",
      data: {
        model: "gemma2:2b",
        prompt: augmentedPrompt,
      },
      responseType: "stream",
    });
 
    axiosResponse.data.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      if (chunkStr.trim()) {
        res.write(`data: ${chunkStr}\n\n`);
      }
    });
 
    axiosResponse.data.on("end", () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });
 
    axiosResponse.data.on("error", (error) => {
      console.error("Error during streaming:", error);
      res.write("data: Error occurred during streaming\n\n");
      res.end();
    });
  } catch (error) {
    console.error("Error during RAG chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));