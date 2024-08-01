import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {DateTimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axiosInstance from '../../utils/axiosInstance.js';
import {useSelector} from 'react-redux';

const AddEventPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(dayjs(date));
  const [end, setEnd] = useState(dayjs(date).add(1, 'hour'));
  const user = useSelector((state) => state.auth.user);

  const handleClick = async () => {
    try {
      const eventData = {
        title,
        description,
        start: start.toISOString(),
        end: end.toISOString(),
        userId: user.id,
      };
      await axiosInstance.post('/events', eventData);
      alert('Event added successfully!');
      navigate('/calendar'); // Navigate to CalendarPage after successful addition
    } catch (error) {
      console.error('Failed to add event:', error);
      alert('Failed to add event.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {date}
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="할 일"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="상세 내용"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                gap: 2, // Adjust the gap value to your preference
              }}
            >
              <DateTimePicker
                label="일정 시작"
                value={start}
                onChange={(newValue) => setStart(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
              />
              <DateTimePicker
                label="일정 종료"
                value={end}
                onChange={(newValue) => setEnd(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
              />
            </Box>
          </LocalizationProvider>
          <Button
            onClick={handleClick}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            일정 추가
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddEventPage;
