import React from 'react';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Dashboard() {
    // Determine if the screen width is less than or equal to 420px
    const isMobile = useMediaQuery('(max-width:420px)');
    // Set drawer width based on screen size
    const drawerWidth = isMobile ? 0 : 15; // Change to 250 or your desired width

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar with dynamic width */}
            <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
                <Sidebar />
            </Box>
            {/* Main content area with margin to prevent overlap */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: isMobile ? 0 : drawerWidth }}>
                <Navbar />
                {/* Your main content here */}
            </Box>
        </Box>
    );
}

export default Dashboard;
