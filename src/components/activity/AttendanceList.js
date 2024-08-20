import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Button,
    Alert,
    useMediaQuery
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';

const generateMapUrl = (geoLocation) => {
    if (!geoLocation) return 'N/A';
    const [latitude, longitude] = geoLocation.split(',');
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&zoom=15&basemap=satellite&markercolor=red`;
};

function AttendanceList() {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [error, setError] = useState(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const params = user.role === 'HR' ? { role: "HR" } : { EmpId: user.emp_id };
                const response = await axios.get(
                    `https://namami-infotech.com/HR-SMILE-BACKEND/src/attendance/view_attendance.php`,
                    { params }
                );

                if (response.data.success) {
                    setActivities(response.data.data);
                } else {
                    setError('Failed to fetch attendance data');
                }
            } catch (error) {
                setError('Error fetching attendance: ' + error.message);
            }
        };

        fetchAttendance();
    }, [user.emp_id, user.role]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const exportToCsv = () => {
        const csvRows = [
            ['Emp ID', 'Date', 'In', 'Out', 'Working Hours', 'Last Event'],
        ];

        activities.forEach(({ empId, date, firstIn, lastOut, lastOutLocation, workingHours, lastEvent }) => {
            csvRows.push([empId, date, firstIn, lastOut, lastOutLocation, workingHours, lastEvent]);
        });

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'attendance.csv');
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Button variant="contained" style={{ backgroundColor: "#1B3156", color: "white" }} onClick={exportToCsv} sx={{ m: 2 }}>
                Export to CSV
            </Button>
            <Paper sx={{ width: '100%', overflow: 'hidden' }} style={{ backgroundColor: "#1B3156" }}>
                {error && <Alert severity="error">{error}</Alert>}

                <TableContainer>
                    <Table>
                        <TableHead style={{ backgroundColor: "#1B3156" }}>
                            <TableRow>
                                <TableCell style={{ color: "white" }}>Emp ID</TableCell>
                                <TableCell style={{ color: "white" }}>Date</TableCell>
                                {!isMobile && <TableCell style={{ color: "white" }}>Work Mode</TableCell>}
                                {!isMobile && <TableCell style={{ color: "white" }}>In</TableCell>}
                                {!isMobile && <TableCell style={{ color: "white" }}>Out</TableCell>}
                                <TableCell style={{ color: "white" }}>Working Hours</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ backgroundColor: "white" }}>
                            {activities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((activity) => (
                                <TableRow key={`${activity.empId}-${activity.date}`}>
                                    <TableCell>{activity.empId}</TableCell>
                                    <TableCell>{activity.date}</TableCell>
                                    {!isMobile && <TableCell>{activity.firstEvent}</TableCell>}
                                    {!isMobile && (
                                        <TableCell>
                                            <a
                                                href={generateMapUrl(activity.firstInLocation)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#1B3156', textDecoration: 'none' }}
                                            >
                                                {activity.firstIn}
                                            </a>
                                        </TableCell>
                                    )}
                                    {!isMobile && (
                                        <TableCell>
                                            <a
                                                href={generateMapUrl(activity.lastOutLocation)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#1B3156', textDecoration: 'none' }}
                                            >
                                                {activity.lastOut}
                                            </a>
                                        </TableCell>
                                    )}
                                    <TableCell>{activity.workingHours}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={activities.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "#1B3156", color: "white" }}
                />
            </Paper>
        </>
    );
}

export default AttendanceList;
