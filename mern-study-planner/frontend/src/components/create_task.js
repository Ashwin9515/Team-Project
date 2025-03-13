import { TextField, Button, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, FormControlLabel, Checkbox } from "@mui/material";
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

  // Enhanced fetch with error handling
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks",
        { params: { completed: false } } // Fetch incomplete tasks by default
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Add error state handling here
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

  const handleSubmit = async () => {
    try {
      const url = formData._id 
        ? `https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks/${formData._id}`
        : "https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks";

      const method = formData._id ? "put" : "post";
      
      const response = await axios[method](url, {
        ...formData,
        percentComp: Number(formData.percentComp) // Ensure number type
      });

      if (formData._id) {
        setTasks(prev => prev.map(task => 
          task._id === formData._id ? response.data.task : task
        ));
      } else {
        setTasks(prev => [...prev, response.data.task]);
      }

      handleClear();
      await fetchTasks(); // Refresh list with latest data

    } catch (error) {
      console.error("Error saving task:", error);
      // Add error state handling here
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(
        `https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks/${taskId}`
      );
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      _id: task._id,
      title: task.title,
      subject: task.subject,
      description: task.description,
      startdate: task.startdate,
      deadline: task.deadline,
      completed: task.completed,
      percentComp: task.percentComp
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid2 container spacing={5} direction="row" justifyContent="center" alignItems="center">
        {/* Form Fields */}
        <Grid2 item md={4} sm={12}>
          <TextField
            name="title"
            label="Task Title"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.title}
            fullWidth
          />
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <TextField
            name="subject"
            label="Subject"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.subject}
            fullWidth
          />
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <TextField
            name="description"
            label="Description"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.description}
            fullWidth
            multiline
            rows={3}
          />
        </Grid2>

        {/* Date Fields */}
        <Grid2 item md={4} sm={12}>
          <TextField
            name="startdate"
            label="Start Date"
            type="date"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.startdate}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <TextField
            name="deadline"
            label="Deadline"
            type="date"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.deadline}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid2>

        {/* Completion Fields */}
        <Grid2 item md={4} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.completed}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Completed"
          />
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <TextField
            name="percentComp"
            label="Progress (%)"
            type="number"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.percentComp}
            fullWidth
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
        </Grid2>

        {/* Action Buttons */}
        <Grid2 item md={4} sm={12}>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            fullWidth
            color={formData._id ? "warning" : "primary"}
          >
            {formData._id ? "Update Task" : "Add Task"}
          </Button>
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <Button 
            variant="outlined" 
            onClick={handleClear} 
            fullWidth
          >
            Clear
          </Button>
        </Grid2>
      </Grid2>

      {/* Enhanced Task Table */}
      <Paper sx={{ marginTop: 4, padding: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Task Management
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Title', 'Subject', 'Description', 'Start', 'Deadline', 'Completed', 'Progress', 'Actions'].map(header => (
                  <TableCell key={header} sx={{ fontWeight: '600' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task._id} hover>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.subject}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{task.description}</TableCell>
                  <TableCell>{new Date(task.startdate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
                  <TableCell>{task.completed ? '✅' : '❌'}</TableCell>
                  <TableCell>
                    <progress 
                      value={task.percentComp} 
                      max="100" 
                      style={{ width: '80px' }}
                    />
                    {task.percentComp}%
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      onClick={() => handleEdit(task)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default CreateTask;
