import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import Calendar from 'react-calendar'; // react-calendar 패키지 사용
import axios from '../../utils/axiosInstance';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    // Fetch events when the component mounts
    axios.get('/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleDateChange = newDate => {
    setDate(newDate);
    setSelectedDate(newDate.toISOString().split('T')[0]); // YYYY-MM-DD 형식
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveEvent = () => {
    const event = { date: selectedDate, title: eventTitle };
    axios.post('/events', event)
      .then(() => {
        setEvents(prevEvents => ({
          ...prevEvents,
          [selectedDate]: [...(prevEvents[selectedDate] || []), event]
        }));
        setEventTitle('');
        handleCloseDialog();
      })
      .catch(error => console.error('Error saving event:', error));
  };

  const renderEvents = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const eventList = events[formattedDate] || [];
    return (
      <List>
        {eventList.map((event, index) => (
          <ListItem key={index}>
            <ListItemText primary={event.title} />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        공유 캘린더
      </Typography>
      <Box display="flex" justifyContent="center">
        <Calendar
          onChange={handleDateChange}
          value={date}
        />
      </Box>
      <Box mt={4}>
        {renderEvents(date)}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
      >
        일정 추가
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>일정 추가</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="일정 제목"
            fullWidth
            variant="outlined"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleSaveEvent} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CalendarPage;
