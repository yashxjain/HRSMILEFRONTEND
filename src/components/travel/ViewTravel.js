import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TableFooter, TablePagination, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function ViewTravel({ EmpId }) {
    const [travelExpenses, setTravelExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchTravelExpenses = async () => {
            try {
                if (!EmpId) {
                    setError('Employee ID is missing');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('https://namami-infotech.com/HR-SMILE-BACKEND/src/travel/get_travel.php', {
                    params: { empId: EmpId }
                });

                if (response.data.success) {
                    setTravelExpenses(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Error fetching travel expenses data');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTravelExpenses();
    }, [EmpId]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewImage = (base64Data) => {
        // Ensure base64Data includes the correct data URL scheme
        if (!base64Data.startsWith('data:image/')) {
            base64Data = `data:image/png;base64,${base64Data}`;
        }

        // Create a new Blob from the base64 string
        const byteString = atob(base64Data.split(',')[1]);
        const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });

        // Create a URL for the Blob and open it in a new tab
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');

        // Optional: Revoke the object URL after some time to free memory
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 1000);
    };

    return (
        <Box>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && !error && (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Destination</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Time From</TableCell>
                                    <TableCell>Time To</TableCell>
                                    <TableCell>Receipt</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {travelExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{formatDate(expense.ExpenseDate)}</TableCell>
                                        <TableCell>{expense.TravelDestination}</TableCell>
                                        <TableCell>{expense.expenseAmount}</TableCell>
                                        <TableCell>{expense.TravelTimeFrom}</TableCell>
                                        <TableCell>{expense.TravelTimeTo}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" onClick={() => handleViewImage(expense.TravelReceipt)}>
                                                View Receipt
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        count={travelExpenses.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Box>
    );
}

export default ViewTravel;
