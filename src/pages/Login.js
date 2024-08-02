import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { Container, TextField, Button, Box, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import logo from '../assets/HRSmileLogo.jpeg';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#f50057',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

function Login() {
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/auth/login.php', {
                EmpId: empId,
                password: password,
            });

            if (response.data.success) {
                login(response.data.data);
                setTimeout(() => {
                    setLoading(false);
                    navigate('/dashboard');
                }, 1500); // Delay for 1.5 seconds
            } else {
                setLoading(false);
                setError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            setError('An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: '#1B3156' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Box sx={{ mb: 2 }}>
                        <img src={logo} alt="HRMS Logo" style={{ width: '120px', height: '120px' }} />
                    </Box>
                    <Typography variant="h4" align="center" style={{ color: "#6695AF" }} gutterBottom>
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: "#1B3156" }}
                            type="submit"
                            sx={{ mt: 3, py: 1.5 }}
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
