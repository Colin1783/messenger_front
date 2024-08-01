import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import {Box, Button, Container, TextField, Typography} from '@mui/material';

export const SettingsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [birthdate, setBirthdate] = useState(user.birthdate);
  const [cellphone, setCellphone] = useState(user.cellphone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/users/update', {
        id: user.id,
        email,
        name,
        birthdate,
        cellphone,
        currentPassword,
        newPassword,
      });
      setSuccess('Profile updated successfully');
      setError('');
    } catch (err) {
      setError('Update failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <form onSubmit={handleUpdate}>
          <Box mb={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={user.username}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Birthdate"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Cellphone"
              variant="outlined"
              fullWidth
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Current Password"
              type="password"
              variant="outlined"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Box>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" gutterBottom>
              {success}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update
          </Button>
        </form>
      </Box>
    </Container>
  );
};
