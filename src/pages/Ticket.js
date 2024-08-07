import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Box, Button, useMediaQuery } from '@mui/material';
import { useAuth } from '../components/auth/AuthContext';
import ViewTickets from '../components/ticket/ViewTickets';



function Ticket() {
    const { user } = useAuth();
    const [openApplyExpenseDialog, setOpenApplyExpenseDialog] = useState(false);

    const isMobile = useMediaQuery('(max-width:600px)');
    const drawerWidth = isMobile ? 0 : 25;

    const handleOpenApplyExpenseDialog = () => setOpenApplyExpenseDialog(true);
    const handleCloseApplyExpenseDialog = () => setOpenApplyExpenseDialog(false);



    const handleExpenseApplied = () => {
        // Handle the expense application success here if needed
        // For example, showing a confirmation message or refreshing data
        handleCloseApplyExpenseDialog();
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar with fixed width */}
            <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
                <Sidebar />
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: drawerWidth }}>
                <Navbar />
                <div style={{ marginTop: "20px" }}>




                    <br />
                    <br />
                    {/* Uncomment and update the ViewLeave component as needed */}
                    {user && user.emp_id && <ViewTickets empId={user.emp_id} />}
                </div>
            </Box>
        </Box>
    );
}

export default Ticket;
