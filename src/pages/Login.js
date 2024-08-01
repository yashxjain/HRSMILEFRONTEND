import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import logo from '../assets/HRSmileLogo.jpeg';

function Login() {
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/auth/login.php', {
                EmpId: empId,
                password: password,
            });

            if (response.data.success) {
                login(empId); // Update Auth Context and localStorage
                navigate('/dashboard');
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
                <Box sx={{ mb: 2 }}>
                    <img src={logo} alt="HRMS Logo" style={{ width: '100px', height: '100px' }} />
                </Box>
                <Typography variant="h4" align="center" gutterBottom>
                    HR SMILE Login
                </Typography>
                {error && (
                    <Typography variant="body2" color="error" align="center">
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        variant="outlined"
                        value={empId}
                        onChange={(e) => setEmpId(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 3 }}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Login;
