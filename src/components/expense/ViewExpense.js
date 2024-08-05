import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TableFooter, TablePagination, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function ViewExpense() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
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
        const fetchExpenses = async () => {
            try {
                if (!user || !user.emp_id) {
                    setError('User is not authenticated');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('https://namami-infotech.com/HR-SMILE-BACKEND/src/expense/get_expense.php', {
                    params: { EmpId: user.emp_id }
                });

                if (response.data.success) {
                    setExpenses(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Error fetching expense data');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [user]);

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


    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <br />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Expense Date</TableCell>
                            <TableCell>Expense Type</TableCell>
                            <TableCell>Expense Amount</TableCell>
                            <TableCell>Image</TableCell> {/* New column for the "View" button */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{formatDate(expense.expenseDate)}</TableCell>
                                    <TableCell>{expense.expenseType}</TableCell>
                                    <TableCell>{expense.expenseAmount}</TableCell>
                                    <TableCell>
                                        {expense.image ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleViewImage(expense.image)}
                                            >
                                                View
                                            </Button>
                                        ) : (
                                            'No Image'
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={expenses.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ViewExpense;
