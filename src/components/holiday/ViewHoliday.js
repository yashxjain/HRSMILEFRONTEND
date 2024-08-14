import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import AddHoliday from './AddHoliday';
import EditHoliday from './EditHoliday';
import { useAuth } from '../auth/AuthContext';
import EditIcon from '@mui/icons-material/Edit';

function ViewHoliday() {
    const { user } = useAuth();
    const [holidays, setHolidays] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const fetchHolidays = async () => {
        try {
            const response = await axios.get('https://namami-infotech.com/HR-SMILE-BACKEND/src/holiday/view_holiday.php');
            if (response.data.success) {
                setHolidays(response.data.data);
            } else {
                console.error('Failed to fetch holidays');
            }
        } catch (err) {
            console.error('Error fetching holidays:', err);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);

    const handleOpenEditDialog = (holiday) => {
        setSelectedHoliday(holiday);
        setEditDialogOpen(true);
    };
    const handleCloseEditDialog = () => setEditDialogOpen(false);

    const handleHolidayAdded = () => fetchHolidays();

    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return daysOfWeek[date.getDay()];
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div style={{ overflow: 'hidden' }}>
            {user && user.role === 'HR' && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                    sx={{ mb: 2 }}
                    style={{ backgroundColor: "#1B3156" }}
                    component={motion.div}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Add Holiday
                </Button>
            )}

            <TableContainer component={Paper} style={{ maxWidth: '100%', overflow: 'hidden' }}  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <Table>
                    <TableHead style={{ backgroundColor: "#1B3156" }}>
                        <TableRow>
                            <TableCell style={{ color: "white" }}>Date</TableCell>
                            <TableCell style={{ color: "white" }}>Day</TableCell>
                            <TableCell style={{ color: "white" }}>Title</TableCell>
                            {user && user.role === 'HR' && <TableCell style={{ color: "white" }}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {holidays.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((holiday) => (
                            <TableRow key={holiday.date} component={motion.tr} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <TableCell>{formatDate(holiday.date)}</TableCell>
                                <TableCell>{getDayOfWeek(holiday.date)}</TableCell>
                                <TableCell>{holiday.title}</TableCell>
                                {user && user.role === 'HR' && (
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenEditDialog(holiday)} aria-label="edit" component={motion.div} whileHover={{ scale: 1.2 }}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={holidays.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
            <AddHoliday open={dialogOpen} onClose={handleCloseDialog} onHolidayAdded={handleHolidayAdded} />
            <EditHoliday open={editDialogOpen} onClose={handleCloseEditDialog} holiday={selectedHoliday} onHolidayUpdated={fetchHolidays} />
        </div>
    );
}

export default ViewHoliday;
