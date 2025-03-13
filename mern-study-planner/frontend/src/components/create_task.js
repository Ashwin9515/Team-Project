import { TextField, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    subject: "",
    description: "",
    startdate: "",
    deadline: "",
    completed: false,
    percentComp: 0
  });

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClear = () => {
    setFormData({
      _id: "",
      title: "",
      subject: "",
      description: "",
      startdate: "",
      deadline: "",
      completed: false,
      percentComp: 0
    });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setFormData(prev => ({ ...prev, completed: !prev.completed }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        const response = await axios.put(`/api/tasks/${formData._id}`, formData);
        setTasks(prevTasks => prevTasks.map(task => 
          task._id === formData._id ? response.data.task : task
        ));
      } else {
        const response = await axios.post("/api/tasks", formData);
        setTasks(prevTasks => [...prevTasks, response.data.task]);
      }
      handleClear();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    setFormData(task);
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: '2rem' }}>
      <Typography variant="h4" gutterBottom>Create/Edit Task</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleTextChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleTextChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleTextChange}
              multiline
              rows={3}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              name="startdate"
              type="date"
              value={formData.startdate}
              onChange={handleTextChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleTextChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.completed}
                  onChange={handleCheckboxChange}
                  name="completed"
                />
              }
              label="Completed"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Progress (%)"
              name="percentComp"
              type="number"
              value={formData.percentComp}
              onChange={handleTextChange}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              {formData._id ? "Update Task" : "Create Task"}
            </Button>
            <Button variant="outlined" onClick={handleClear} sx={{ ml: 2 }}>
              Clear Form
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Task List</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.subject}</TableCell>
                <TableCell>{task.deadline}</TableCell>
                <TableCell>{task.percentComp}%</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(task)}>Edit</Button>
                  <Button onClick={() => handleDelete(task._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CreateTask;
