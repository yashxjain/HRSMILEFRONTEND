import React from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Toolbar, Typography, Avatar, Button, Menu, MenuItem, Box, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout(); // Update Auth Context
        navigate('/');
        handleClose();
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                    HR Dashboard
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {user ? user.empId : 'Guest'}
                    </Typography>
                    <Button color="inherit" onClick={handleMenu}>
                        <Avatar sx={{ mr: 2 }}>
                            <AccountCircleIcon />
                        </Avatar>
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                    <IconButton>
                        <NotificationsIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
