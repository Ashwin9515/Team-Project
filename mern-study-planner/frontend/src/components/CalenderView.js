import { Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import FullCalendar from "@fullcalendar/react"; 
import dayGridPlugin from "@fullcalendar/daygrid"; 
import { useState } from "react";

const CalendarView = ({ data }) => {
  // State for managing dialog visibility and selected event details
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Format task data to be used by FullCalendar
  const events = data.map((task) => ({
    title: task.title,
    start: task.end_date,  // Use task's deadline as start date
    end: task.end_date,    // Same as start for a single-day event
    extendedProps: {       // Store additional task data in extendedProps
      completion: task.percent_complete,
    },
  }));

  // Handler for event click
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);  // Set the clicked event details
    setOpenDialog(true);  // Open the dialog
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);  // Close the dialog
  };

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
          eventClick={handleEventClick}  // Show dialog when clicking an event
        />
      </div>

      {/* Dialog to display event details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedEvent?.title}</DialogTitle>
        <DialogContent>
          <p>Completion: {selectedEvent?.extendedProps.completion}%</p>
          <p>Start Date: {selectedEvent?.start.toString()}</p>
          <p>End Date: {selectedEvent?.end.toString()}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CalendarView;
