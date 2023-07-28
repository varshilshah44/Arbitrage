import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Box, Container } from '@mui/material';
import { toast } from "react-toastify";
import AxiosInstance from '../helpers/AxiosRequest';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const response = await AxiosInstance.post("/user/login", {
        email: email,
        password: password
      });

      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.status) 
        localStorage.setItem("accessToken", response.data.token);
        navigate('/currency-table')
      } else {
        toast.error(response?.response?.data?.message || 'Logged in failed')
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong')
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: '70%',
          p: '2rem',
          backgroundColor: '#ffffff',
          borderRadius: '4px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="text"
            value={email}
            onChange={handleUsernameChange}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            fullWidth
            margin="normal"
          />

          <Button variant="contained" type="submit" fullWidth>
            Sign In
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;