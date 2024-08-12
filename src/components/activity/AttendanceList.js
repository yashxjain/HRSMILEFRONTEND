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
    Typography,
    useMediaQuery,
    Alert,
    Button
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const generateMapUrl = (geoLocation) => `https://www.google.com/maps/@${geoLocation},15z?entry=ttu`;

function AttendanceList() {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [error, setError] = useState(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const params = user.role === 'HR' ? { role: "HR" } : { EmpId: user.emp_id };
                const response = await axios.get(
                    'https://namami-infotech.com/HR-SMILE-BACKEND/src/attendance/view_attendance.php',
                    { params }
                );

                console.log('API Response:', response.data); // Log the raw data from the API

                if (response.data.success) {
                    const data = response.data.data;

                    const flattenedData = [];
                    const empWiseActivities = {};

                    data.forEach((activity) => {
                        const empId = activity.EmpId;
                        if (!empWiseActivities[empId]) {
                            empWiseActivities[empId] = [];
                        }
                        empWiseActivities[empId].push(activity);
                    });

                    console.log('Grouped Activities:', empWiseActivities); // Log grouped activities by employee

                    Object.keys(empWiseActivities).forEach((empId) => {
                        const activities = empWiseActivities[empId];
                        const dateWiseActivities = {};
                        activities.forEach((activity) => {
                            const date = formatDate(activity.MobileDateTime);
                            if (!dateWiseActivities[date]) {
                                dateWiseActivities[date] = [];
                            }
                            dateWiseActivities[date].push(activity);
                        });

                        console.log('Date Wise Activities:', dateWiseActivities); // Log activities grouped by date

                        Object.keys(dateWiseActivities).forEach((date) => {
                            const activitiesOnDate = dateWiseActivities[date];
                            console.log('Activities on Date:', activitiesOnDate); // Log activities for a specific date

                            // Ensure you are not reversing the array more than necessary
                            const activitiesForProcessing = [...activitiesOnDate];

                            const firstIn = activitiesForProcessing.find((act) => {
                                const cleanedEvent = cleanEvent(act.Event);
                                console.log('Cleaned Event (First In):', cleanedEvent); // Log cleaned event for debugging
                                return cleanedEvent === 'In';
                            });
                            const lastOut = activitiesForProcessing.reverse().find((act) => {
                                const cleanedEvent = cleanEvent(act.Event);
                                console.log('Cleaned Event (Last Out):', cleanedEvent); // Log cleaned event for debugging
                                return cleanedEvent === 'Out';
                            });

                            // Reset array order if necessary
                            activitiesForProcessing.reverse();

                            const lastEvent = activitiesForProcessing[0]?.Event || 'N/A';

                            const workingHours =
                                firstIn && lastOut
                                    ? calculateWorkingHours(firstIn.MobileDateTime, lastOut.MobileDateTime)
                                    : 'N/A';

                            flattenedData.push({
                                empId,
                                date,
                                firstIn: firstIn ? formatTime(firstIn.MobileDateTime) : 'N/A',
                                firstInLocation: firstIn ? generateMapUrl(firstIn.GeoLocation) : 'N/A',
                                lastOut: lastOut ? formatTime(lastOut.MobileDateTime) : 'N/A',
                                lastOutLocation: lastOut ? generateMapUrl(lastOut.GeoLocation) : 'N/A',
                                workingHours,
                                lastEvent
                            });
                        });
                    });

                    const sortedData = flattenedData.sort(
                        (a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))
                    );

                    console.log('Flattened and Sorted Data:', sortedData); // Log final sorted data

                    setActivities(sortedData);
                } else {
                    setError('Failed to fetch attendance data');
                }
            } catch (error) {
                setError('Error fetching attendance: ' + error.message);
            }
        };

        fetchAttendance();
    }, [user.emp_id, user.role]);

    const cleanEvent = (event) => {
        const match = event.match(/^(In|Out):\s*(.*)$/);
        const cleanedEvent = match ? match[1].trim() : event.trim(); // Extract only "In" or "Out"
        console.log('Raw Event:', event); // Log raw event for debugging
        console.log('Cleaned Event:', cleanedEvent); // Log cleaned event for debugging
        return cleanedEvent;
    };



    const calculateWorkingHours = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diff = (end - start) / (1000 * 60);

        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;

        return `${hours} hrs, ${minutes.toFixed(0)} mins`;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const groupedByDate = activities.reduce((acc, activity) => {
        if (!acc[activity.date]) {
            acc[activity.date] = [];
        }
        acc[activity.date].push(activity);
        return acc;
    }, {});

    const groupedData = Object.keys(groupedByDate).map(date => ({
        date,
        activities: groupedByDate[date]
    }));

    const exportToCsv = () => {
        const csvRows = [
            ['Emp ID', 'Date', 'In', 'In Location', 'Out', 'Out Location', 'Working Hours', 'Last Event'],
        ];

        activities.forEach(({ empId, date, firstIn, firstInLocation, lastOut, lastOutLocation, workingHours, lastEvent }) => {
            csvRows.push([empId, date, firstIn, firstInLocation, lastOut, lastOutLocation, workingHours, lastEvent]);
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
                                {!isMobile && <TableCell style={{ color: "white" }}>Event</TableCell>}
                                {!isMobile && <TableCell style={{ color: "white" }}>In</TableCell>}
                                {!isMobile && <TableCell style={{ color: "white" }}>In Location</TableCell>}
                                {!isMobile && <TableCell style={{ color: "white" }}>Out</TableCell>}
                                {!isMobile && <TableCell style={{ color: "white" }}>Out Location</TableCell>}
                                <TableCell style={{ color: "white" }}>Working Hours</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ backgroundColor: "white" }}>
                            {groupedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({ date, activities }) => (
                                <React.Fragment key={date}>
                                    <TableRow>
                                        <TableCell colSpan={isMobile ? 3 : 8}>
                                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                {date}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    {activities.map(({ empId, firstIn, firstInLocation, lastOut, lastOutLocation, workingHours, lastEvent }) => (
                                        <TableRow key={`${empId}-${date}`}>
                                            <TableCell>{empId}</TableCell>
                                            <TableCell>{date}</TableCell>
                                            {!isMobile && <TableCell>{lastEvent}</TableCell>}
                                            {!isMobile && <TableCell>{firstIn}</TableCell>}
                                            {!isMobile && (
                                                <TableCell>
                                                    {firstInLocation !== 'N/A' ? (
                                                        <a href={firstInLocation} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                                            View Location
                                                        </a>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </TableCell>
                                            )}
                                            {!isMobile && <TableCell>{lastOut}</TableCell>}
                                            {!isMobile && (
                                                <TableCell>
                                                    {lastOutLocation !== 'N/A' ? (
                                                        <a href={lastOutLocation} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                                            View Location
                                                        </a>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </TableCell>
                                            )}
                                            <TableCell>{workingHours}</TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
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
                    style={{ backgroundColor: "white" }}
                />
            </Paper>
        </>
    );
}

export default AttendanceList;
