require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

mongoose
  .connect(`${process.env.MONGO_URI}/TeamProject`)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Task Schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  startdate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  percentComp: { type: Number, default: 0 },
});

const Task = mongoose.model("Task", TaskSchema, "tasks");

// Profile Schema
const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, required: true },
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
  if (!email) return res.status(400).json({ error: "Please provide an email address." });

  const profile = await Profile.findOne({ email });
  
  if (!profile) {
    return res.json({
      name: "New User",
      email,
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

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
