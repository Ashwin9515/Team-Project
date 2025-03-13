import React, { useEffect, useState } from "react";
import axios from "axios";
 
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    task: "",
    subject: "",
    desc: "",
    startdate: "",
    deadline: "",
    completed: false,
    percentComp: 0,
  });
 
  useEffect(() => {
    fetchTasks();
  }, []);
 
  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
 
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks", newTask);
      fetchTasks();
      setNewTask({
        task: "",
        subject: "",
        desc: "",
        startdate: "",
        deadline: "",
        completed: false,
        percentComp: 0,
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
 
  const handleEdit = async (id) => {
    const updatedTask = tasks.find((task) => task._id === id);
    const newDesc = prompt("Edit description:", updatedTask.desc);
    if (newDesc !== null) {
      try {
        // Only send the field that needs to be updated (desc)
        await axios.put(
          `https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks/${id}`,
          {
            desc: newDesc, // Only send the field you're updating
          }
        );
        fetchTasks(); // Refresh task list
      } catch (error) {
        console.error("Error editing task:", error);
      }
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      console.log("Deleting task with ID:", id); // Add more logging to verify
      try {
        const response = await axios.delete(`https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks/${id}`);
        console.log("Deleted task response:", response.data); // Log response to check if deletion was successful
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };
 
  return (
    <div>
      <h2>Task List</h2>
      <form onSubmit={handleSubmit}>
        <input name="task" value={newTask.task} onChange={handleChange} placeholder="Task" required />
        <input name="subject" value={newTask.subject} onChange={handleChange} placeholder="Subject" required />
        <input name="desc" value={newTask.desc} onChange={handleChange} placeholder="Description" required />
        <input type="date" name="startdate" value={newTask.startdate} onChange={handleChange} required />
        <input type="date" name="deadline" value={newTask.deadline} onChange={handleChange} required />
        <button type="submit">Add Task</button>
      </form>
 
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th>Completed</th>
            <th>Progress (%)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.task}</td>
              <td>{task.subject}</td>
              <td>{task.desc}</td>
              <td>{new Date(task.startdate).toLocaleDateString()}</td>
              <td>{new Date(task.deadline).toLocaleDateString()}</td>
              <td>{task.completed ? "Yes" : "No"}</td>
              <td>{task.percentComp}</td>
              <td>
                <button onClick={() => handleEdit(task._id)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
 
export default TaskList;