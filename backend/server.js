require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(`${process.env.MONGO_URI}/TeamProject`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", TaskSchema, "tasks");

const ProfileSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});
const Profile = mongoose.model("Profile", ProfileSchema, "profiles");

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json({ message: "Task added successfully", task: newTask });
});

app.get("/api/profile", async (req, res) => {
  const profile = await Profile.findOne(); // Assuming single profile for now
  res.json(profile);
});

app.post("/api/profile", async (req, res) => {
  await Profile.findOneAndUpdate({}, req.body, { upsert: true });
  res.json({ message: "Profile updated" });
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  
  let response;
  if (message.toLowerCase().includes("hello")) {
    response = "Hello! How can I assist you today?";
  } else if (message.toLowerCase().includes("tasks")) {
    response = "You can view or create tasks in the 'Tasks' section.";
  } else {
    response = "I'm still learning! Please ask something related to the study planner.";
  }

  res.json({ reply: response });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
