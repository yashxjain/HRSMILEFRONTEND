import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import {
    Container, TextField, Button, Box, Typography, Paper, Avatar, CircularProgress, Grid, IconButton, InputAdornment
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import logo from '../assets/HRSmileLogo.jpeg';
import logo1 from '../assets/NamamiInfotech.jpeg';

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
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

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
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center" >
                    {/* Left side: Company logo, name, and title */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <img src={logo1} alt="Namami Infotech Logo" style={{ width: '150px', marginBottom: '20px' }} />
                            <Typography variant="h4" align="center" sx={{ color: '#1B3156', fontWeight: 'bold' }}>
                                Namami Infotech
                            </Typography>
                            <Typography variant="h5" align="center" sx={{ color: '#6695AF', mt: 1 }}>
                                Concept To Creation
                            </Typography>
                            <Typography variant="h6" align="center" sx={{ color: '#6695AF', mt: 1 }}>
                                Leading the Future of Technology
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Right side: Login form and HR Smile logo */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ m: 1, bgcolor: '#1B3156' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <img src={logo} alt="Namami Infotech Logo" style={{ width: '150px', marginBottom: '20px' }} />

                            <Typography variant="h4" align="center" sx={{ color: '#6695AF' }} gutterBottom>
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
                                    type={showPassword ? 'text' : 'password'}
                                    margin="normal"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    style={{ backgroundColor: "#1B3156" }}
                                    type="submit"
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        mb: { xs: 2, md: 0 } // Adds 2 units of margin-bottom on extra small screens, 0 on medium and above
                                    }}
                                    disabled={loading} // Disable button when loading
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Login'}
                                </Button>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
