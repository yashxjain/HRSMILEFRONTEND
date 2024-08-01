import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HRSmileLogo from '../assets/HRSmileLogo.jpeg';
import useMediaQuery from '@mui/material/useMediaQuery';

function Sidebar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:420px)');

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Define your routes
    const routes = [
        { path: '/dashboard', name: 'Dashboard' },
        { path: '/employees', name: 'Employees' },
        { path: '/holiday', name: 'Holiday' },
        { path: '/policy', name: 'Policy' },
        { path: '/attendance', name: 'Attendance' },
        { path: '/notification', name: 'Notification' },
        { path: '/leave', name: 'Leave' }
    ];

    const drawer = (
        <Box sx={{ width: 150 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <img src={HRSmileLogo} alt="HRMS Logo" style={{ width: '100px', marginBottom: '20px' }} />
            </Box>
            <List>
                {routes.map((route, index) => (
                    <ListItem
                        button
                        key={index}
                        component={Link}
                        to={route.path}
                        sx={{
                            backgroundColor: location.pathname === route.path ? 'primary.main' : 'transparent',
                            color: location.pathname === route.path ? 'white' : 'inherit',
                            '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                            },
                        }}
                        onClick={() => setMobileOpen(false)}
                    >
                        <ListItemText primary={route.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {isMobile ? (
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            HRMS
                        </Typography>
                    </Toolbar>
                </AppBar>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 150 },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            )}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, mt: isMobile ? 7 : 0 }}
            >
                {/* Your main content goes here */}
            </Box>
        </Box>
    );
}

export default Sidebar;
