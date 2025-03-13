require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(`${process.env.MONGO_URI}/TeamProject`)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Database Schemas
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", TaskSchema, "tasks");

const ProfileSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: String,
});
const Profile = mongoose.model("Profile", ProfileSchema, "profiles");

// Task Routes
app.get("/api/tasks", asyncHandler(async (req, res) => {
  const { completed, search } = req.query;
  const query = {};
  
  if (completed) query.completed = completed === 'true';
  if (search) query.title = { $regex: search, $options: 'i' };
  
  const tasks = await Task.find(query);
  res.json(tasks);
}));

app.post("/api/tasks", asyncHandler(async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json({ message: "Task created successfully", task: newTask });
}));

app.put("/api/tasks/:id", asyncHandler(async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  
  if (!updatedTask) return res.status(404).json({ error: "Task not found" });
  res.json({ message: "Task updated", task: updatedTask });
}));

app.delete("/api/tasks/:id", asyncHandler(async (req, res) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  
  if (!deletedTask) return res.status(404).json({ error: "Task not found" });
  res.json({ message: "Task deleted", task: deletedTask });
}));

// Profile Routes
app.get("/api/profile", asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email parameter required" });

  const profile = await Profile.findOne({ email });
  
  if (!profile) {
    return res.json({
      name: "New User",
      email: email,
      role: "Student"
    });
  }
  
  res.json(profile);
}));

app.post("/api/profile", asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const profile = await Profile.findOneAndUpdate(
    { email },
    req.body,
    { new: true, upsert: true }
  );
  
  res.json({ message: "Profile updated", profile });
}));

// Enhanced Chat Route
app.post("/api/chat", asyncHandler(async (req, res) => {
  const { message, email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  let response;
  const [profile, totalTasks, completedTasks] = await Promise.all([
    Profile.findOne({ email }),
    Task.countDocuments(),
    Task.countDocuments({ completed: true })
  ]);

  const userName = profile?.name || "there";
  const pendingTasks = totalTasks - completedTasks;

  // Response logic
  switch(true) {
    case /hello|hi|hey/i.test(message):
      response = `Hello ${userName}! Ready to tackle some tasks?`;
      break;
    case /task|todo/i.test(message):
      response = `You have ${totalTasks} total tasks (${completedTasks} completed). ${
        totalTasks > 0 ? "Keep going!" : "Add your first task!"
      }`;
      break;
    case /help|support/i.test(message):
      response = "I can help with: \n- Task management \n- Profile updates \n- Progress tracking \n- Deadline reminders";
      break;
    case /how many|pending/i.test(message):
      response = `You have ${pendingTasks} pending tasks and ${completedTasks} completed ones!`;
      break;
    case /reminder|due/i.test(message):
      response = `Don't forget to check deadlines! You have ${pendingTasks} tasks awaiting completion.`;
      break;
    default:
      response = `${userName}, I'm here to help with your study planning. Ask about tasks or your progress!`;
  }

  res.json({ 
    reply: response,
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks,
      userName: profile?.name || "New User"
    }
  });
}));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
