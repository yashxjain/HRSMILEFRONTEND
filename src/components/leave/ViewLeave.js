import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TableFooter, TablePagination } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function ViewLeave() {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
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
        const fetchLeaves = async () => {
            try {
                // Ensure user is not null before making the request
                if (!user || !user.empId) {
                    setError('User is not authenticated');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('https://namami-infotech.com/HR-SMILE-BACKEND/src/leave/get_leave.php', {
                    params: { EmpId: user.empId }
                });
                // console.log(response.data.data)
                if (response.data.success) {
                    setLeaves(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Error fetching leave data');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaves();
    }, [user]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <br />
            <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaves
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((leave) => (
                                <TableRow key={leave.Id}>
                                    <TableCell>{formatDate(leave.StartDate)}</TableCell>
                                    <TableCell>{formatDate(leave.EndDate)}</TableCell>
                                    <TableCell>{leave.Reason}</TableCell>
                                    <TableCell>{leave.Status}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={leaves.length}
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

export default ViewLeave;
