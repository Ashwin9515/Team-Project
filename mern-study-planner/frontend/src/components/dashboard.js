import { Grid } from "@mui/material"; // Update to use `Grid` instead of `Grid2`
import { useState, useEffect } from "react";
import axios from "axios"; // Import axios to make API calls
import PieChart from "./PieChart";
import CalenderView from "./CalenderView";
import Cards from "./DashboardCard";

const Dashboard = () => {
  const [pieData, setPieData] = useState([0, 0, 0, 0]);
  const [calenderData, setCalenderData] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks from the backend
        const response = await axios.get("https://fuzzy-fiesta-4jjprrwwwxqq25g76-5000.app.github.dev/api/tasks"); // Use your backend URL here
        const tasks = response.data;

        let comp = 0, due = 0, notSt = 0, inProg = 0;
        let calData = [];

        tasks.forEach((element) => {
          calData.push({
            id: element._id,
            title: element.task,
            start_date: element.startdate,
            end_date: element.deadline,
            percent_complete: element.percentComp,
          });
          if (element.completed) comp++;
          else if (Date.parse(element.deadline) < Date.now()) due++;
          else if (element.percentComp === 0) notSt++;
          else inProg++;
        });

        // Update the state with the calculated data
        setPieData([comp, inProg, due, notSt]);
        setCalenderData(calData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); // Call the function to fetch tasks on component mount
  }, []);

  return (
    <div>
      <Grid container spacing={2} mb={5}>
        <Grid item sm={3} xs={12}><Cards color="#00E676" data={{ num: pieData[0], label: "Completed" }} /></Grid>
        <Grid item sm={3} xs={12}><Cards color="#29B6F6" data={{ num: pieData[1], label: "In Progress" }} /></Grid>
        <Grid item sm={3} xs={12}><Cards color="#F50057" data={{ num: pieData[2], label: "Due" }} /></Grid>
        <Grid item sm={3} xs={12}><Cards color="#FBC02D" data={{ num: pieData[3], label: "Not Started" }} /></Grid>
      </Grid>

      <Grid container spacing={2} mb={5}>
        <Grid item sm={5} xs={12}>
          <PieChart data={[["Task", "Value"], ["Completed", pieData[0]], ["In Progress", pieData[1]], ["Due", pieData[2]], ["Not Started", pieData[3]]]} title="Task Overview" />
        </Grid>
        <Grid item sm={7} xs={12}>
          <CalenderView data={calenderData} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
