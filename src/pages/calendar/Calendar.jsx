import React, {useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {useNavigate} from 'react-router-dom';
import {Box, Container, Paper} from '@mui/material';
import axiosInstance from '../../utils/axiosInstance.js';
import './calendar.css';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        setEvents(response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end
        })));
      } catch (error) {
        console.error('일정을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    navigate(`/calendar/${arg.dateStr}`);
  };

  const handleEventClick = (info) => {
    navigate(`/calendar/event/${info.event.id}`);
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <Paper elevation={3} sx={{p: 2, width: '100%', height: '90vh'}}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height="auto"
            contentHeight="80vh"
            eventTimeFormat={{
              hour: 'numeric',
              meridiem: 'short'
            }}
            views={{
              dayGridMonth: {
                titleFormat: {year: 'numeric', month: 'long'},
                dayMaxEventRows: 2
              },
              timeGridWeek: {
                titleFormat: {year: 'numeric', month: 'long', day: 'numeric'},
                slotDuration: '01:00:00',
                slotLabelFormat: [
                  {hour: '2-digit', meridiem: false},
                ]
              },
              timeGridDay: {
                titleFormat: {year: 'numeric', month: 'long', day: 'numeric'},
                slotDuration: '01:00:00',
                slotLabelFormat: [
                  {hour: '2-digit', hour12: false},
                ]
              }
            }}
            dayCellContent={(dayCell) => (
              <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div>{dayCell.date.getDate()}</div>
              </div>
            )}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default CalendarPage;
