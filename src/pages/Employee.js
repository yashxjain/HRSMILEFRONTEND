import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EmployeeList from '../components/employee/EmployeeList';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

const drawerWidth = 15; // Set a fixed width for the sidebar

function Employee() {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar with fixed width */}
            <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
                <Sidebar />
            </Box>
            {/* Main content area with margin to prevent overlap */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: drawerWidth }}>
                <Navbar />
                <EmployeeList />
            </Box>
        </Box>
    );
}

export default Employee;
