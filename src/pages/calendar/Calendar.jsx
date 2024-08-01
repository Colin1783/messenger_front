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
          title: event.title,
          start: event.start,  // 이벤트 시작 시간
          end: event.end      // 이벤트 종료 시간
        })));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    navigate(`/calendar/${arg.dateStr}`);
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <Paper elevation={3} sx={{ p: 2, width: '100%', height: '90vh' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height="auto"
            contentHeight="80vh"
            views={{
              dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' },
                dayMaxEventRows: 2
              },
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                slotDuration: '01:00:00',
                slotLabelFormat: [
                  { hour: '2-digit', minute: '2-digit', meridiem: false },
                ]
              },
              timeGridDay: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                slotDuration: '01:00:00',
                slotLabelFormat: [
                  { hour: '2-digit', minute: '2-digit', hour12: false },
                ]
              }
            }}
            dayCellContent={(dayCell) => (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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