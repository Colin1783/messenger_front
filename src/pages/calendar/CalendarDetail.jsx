import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {DateTimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axiosInstance from '../../utils/axiosInstance.js';
import {useSelector} from 'react-redux';

export const CalendarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs().add(1, 'hour'));
  const [error, setError] = useState('');
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/events/${id}`);
        const event = response.data;
        setTitle(event.title);
        setDescription(event.description);
        setStart(dayjs(event.start));
        setEnd(dayjs(event.end));
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setError('일정을 불러오는 데 실패했습니다.');
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdate = async () => {
    if (start.isAfter(end)) {
      setError('시작 날짜는 종료 날짜보다 늦을 수 없습니다.');
      return;
    }

    try {
      const eventData = {
        title,
        description,
        start: start.toISOString(),
        end: end.toISOString(),
        userId: user.id,
      };
      await axiosInstance.put(`/events/${id}`, eventData);
      navigate('/calendar');
    } catch (error) {
      console.error('일정 수정 실패:', error);
      setError(`일정 수정 실패: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/events/${id}`);
      navigate('/calendar');
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      setError(`일정 삭제 실패: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          일정 상세 보기
        </Typography>
        <Box component="form" sx={{ mt: 2, width: '100%' }}>
          <TextField
            fullWidth
            label="할 일"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            error={Boolean(error)}
            helperText={error && '필수 항목입니다.'}
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
            error={Boolean(error)}
            helperText={error && '필수 항목입니다.'}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <DateTimePicker
                label="일정 시작"
                value={start}
                onChange={(newValue) => setStart(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    required
                    error={Boolean(error)}
                    helperText={error && '유효한 날짜를 선택하세요.'}
                  />
                )}
              />
              <DateTimePicker
                label="일정 종료"
                value={end}
                onChange={(newValue) => setEnd(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    required
                    error={Boolean(error)}
                    helperText={error && '유효한 날짜를 선택하세요.'}
                  />
                )}
              />
            </Box>
          </LocalizationProvider>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
            >
              삭제
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
            >
              수정
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

