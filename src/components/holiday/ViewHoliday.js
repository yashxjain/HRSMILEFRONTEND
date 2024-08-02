import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import AddHoliday from './AddHoliday';

function ViewHoliday() {
    const [holidays, setHolidays] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
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

    // Handle change in number of rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);
    const handleHolidayAdded = () => fetchHolidays(); // Refresh the list
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
        <div>
            <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mb: 2 }} style={{ backgroundColor: "#1B3156" }}>
                Add Holiday
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead style={{ backgroundColor: "#1B3156" }}>
                        <TableRow>
                            <TableCell style={{ color: "white" }}>Date</TableCell>
                            <TableCell style={{ color: "white" }}>Day</TableCell>
                            <TableCell style={{ color: "white" }}>Title</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {holidays.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((holiday) => (
                            <TableRow key={holiday.date}>
                                <TableCell>{formatDate(holiday.date)}</TableCell>
                                <TableCell>{getDayOfWeek(holiday.date)}</TableCell>
                                <TableCell>{holiday.title}</TableCell>
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
        </div>
    );
}

export default ViewHoliday;
