import FullCalendar from "@fullcalendar/react"; 
import dayGridPlugin from "@fullcalendar/daygrid"; 
import { Paper } from "@mui/material";

const CalendarView = ({ data }) => {

  // Format task data to be used by FullCalendar
  const events = data.map((task) => ({
    title: task.title,
    start: task.end_date,
    end: task.end_date,
    extendedProps: {
      completion: task.percent_complete,
    },
  }));

  return (
    <Paper>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          weekends={true}
          eventColor="red"
        />
      </div>
    </Paper>
  );
};

export default CalendarView;
