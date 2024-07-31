import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import AddNotification from '../components/notification/AddNotification';
import ViewNotifications from '../components/notification/ViewNotification';


const drawerWidth = 15; // Set a fixed width for the sidebar

function Notification() {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar with fixed width */}
            <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
                <Sidebar />
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: drawerWidth }}>
                <Navbar />
                <div style={{ marginTop: "20px" }}>
                    <AddNotification />

                    <ViewNotifications />
                </div>

            </Box>
        </Box>
    );
}

export default Notification;
