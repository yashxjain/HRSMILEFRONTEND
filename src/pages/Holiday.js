import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import AddHoliday from '../components/holiday/AddHoliday';
import ViewHoliday from '../components/holiday/ViewHoliday';

const drawerWidth = 15; // Set a fixed width for the sidebar

function Holiday() {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar with fixed width */}
            <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
                <Sidebar />
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: drawerWidth }}>
                <Navbar />
                <div style={{ marginTop: "20px" }}>
                    <AddHoliday />
                    <ViewHoliday />
                </div>

            </Box>
        </Box>
    );
}

export default Holiday;
