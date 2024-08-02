import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Box, Button } from '@mui/material';
import ApplyExpense from '../components/expense/ApplyExpense';
import { useAuth } from '../components/auth/AuthContext';
import ViewExpense from '../components/expense/ViewExpense';

const drawerWidth = 15; // Set a fixed width for the sidebar (240px is a common width for sidebars)

function Expense() {
    const { user } = useAuth();
    const [openApplyExpenseDialog, setOpenApplyExpenseDialog] = useState(false);



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

                    <Button variant="contained" color="primary" onClick={handleOpenApplyExpenseDialog} style={{ marginLeft: '10px' }}>
                        Apply for Expense
                    </Button>

                    <ApplyExpense
                        open={openApplyExpenseDialog}
                        onClose={handleCloseApplyExpenseDialog}
                        onExpenseApplied={handleExpenseApplied}
                    />
                    {/* Uncomment and update the ViewLeave component as needed */}
                    {user && user.empId && <ViewExpense EmpId={user.empId} />}
                </div>
            </Box>
        </Box>
    );
}

export default Expense;
