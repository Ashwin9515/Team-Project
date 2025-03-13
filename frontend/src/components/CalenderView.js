import FullCalendar from "@fullcalendar/react"; 
import dayGridPlugin from "@fullcalendar/daygrid"; 
import { Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"; 
import { useState } from "react";

const CalendarView = ({ data }) => {

  // Format task data to be used by FullCalendar
  const events = data.map((task) => ({
    title: task.title,
    start: task.end_date,  // Use task's deadline as start date
    end: task.end_date,    // Same as start for a single-day event
    extendedProps: {       // Store additional task data in extendedProps
      completion: task.percent_complete,
    },
  }));

  return (
    <Paper>
      <div>
        {/* FullCalendar component */}
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          weekends={true}
          eventColor="red"  // This will make all events red
        />
      </div>
    </Paper>
  );
};

export default CalendarView;
