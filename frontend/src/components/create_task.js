import { TextField, Button, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    taskid: "",
    task: "",
    subject: "",
    desc: "",
    startdate: "",
    deadline: "",
    completed: false,
    percentComp: 0
  });

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleClear = () => {
    setFormData({
      taskid: "",
      task: "",
      subject: "",
      desc: "",
      startdate: "",
      deadline: "",
      completed: false,
      percentComp: 0
    });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      completed: !prev.completed,
    }));
  };

  const handleSubmit = () => {
    if (formData.taskid) {
      // Update existing task
      axios
        .put(`https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks/${formData.taskid}`, formData)
        .then((response) => {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.taskid === formData.taskid ? response.data : task
            )
          );
        })
        .catch((error) => console.error("Error updating task:", error));
    } else {
      // Create new task
      axios
        .post("https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks", formData)
        .then((response) => {
          setTasks((prev) => [...prev, response.data.task]);
        })
        .catch((error) => console.error("Error adding task:", error));
    }

    handleClear();
  };

  const handleDelete = (taskid) => {
    axios
      .delete(`https://cuddly-adventure-g4xwpjpw4v7r25vv-5000.app.github.dev/api/tasks/${taskid}`)
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.taskid !== taskid));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const handleEdit = (task) => {
    setFormData(task);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid2 container spacing={5} direction="row" justifyContent="center" alignItems="center">
        <Grid2 item md={4} sm={12}>
          <TextField
            variant="outlined"
            onChange={handleTextChange}
            value={formData.task}
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
            name="desc"
            label="Description"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.desc}
            fullWidth
          />
        </Grid2>
        <Grid2 item md={4} sm={12}>
          <TextField
            name="startdate"
            label="Start Date"
            type="date"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.startdate}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
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
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid2>

        {/* New Fields */}
        <Grid2 item md={4} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.completed}
                onChange={handleCheckboxChange}
                name="completed"
                color="primary"
              />
            }
            label="Completed"
          />
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <TextField
            name="percentComp"
            label="Percentage Completed"
            type="number"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.percentComp}
            fullWidth
            InputProps={{
              inputProps: { min: 0, max: 100 }
            }}
          />
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            {formData.taskid ? "Update Task" : "Add Task"}
          </Button>
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <Button variant="contained" onClick={handleClear} fullWidth>
            Clear
          </Button>
        </Grid2>
      </Grid2>

      {/* Task List Table */}
      <Paper sx={{ marginTop: "2rem", padding: "1rem" }}>
        <Typography variant="h6" gutterBottom>
          Task List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Task</strong></TableCell>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Start Date</strong></TableCell>
                <TableCell><strong>Deadline</strong></TableCell>
                <TableCell><strong>Completed</strong></TableCell>
                <TableCell><strong>% Completed</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.subject}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.startdate}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.completed ? "Yes" : "No"}</TableCell>
                  <TableCell>{task.percentComp}%</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(task)} style={{ marginRight: "8px" }}>
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(task._id)}>
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
