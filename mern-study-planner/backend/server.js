const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

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
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
