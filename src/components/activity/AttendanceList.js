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
    Box,
    useMediaQuery
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

function AttendanceList() {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(
                    'https://namami-infotech.com/HR-SMILE-BACKEND/src/attendance/view_attendance.php', {
                    params: { EmpId: user.emp_id }
                }
                );
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

                        Object.keys(dateWiseActivities).forEach((date) => {
                            const activitiesOnDate = dateWiseActivities[date];
                            const firstIn = activitiesOnDate.find((act) => act.Event === 'In');
                            const lastOut = activitiesOnDate.reverse().find((act) => act.Event === 'Out');

                            const workingHours =
                                firstIn && lastOut
                                    ? calculateWorkingHours(firstIn.MobileDateTime, lastOut.MobileDateTime)
                                    : 'N/A';

                            flattenedData.push({
                                empId,
                                date,
                                firstIn: firstIn ? formatTime(firstIn.MobileDateTime) : 'N/A',
                                firstInLocation: firstIn ? `https://www.google.com/maps/@${firstIn.GeoLocation},15z?entry=ttu` : 'N/A',
                                lastOut: lastOut ? formatTime(lastOut.MobileDateTime) : 'N/A',
                                lastOutLocation: lastOut ? `https://www.google.com/maps/@${lastOut.GeoLocation},15z?entry=ttu` : 'N/A',
                                workingHours
                            });
                        });
                    });

                    const sortedData = flattenedData.sort(
                        (a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))
                    );

                    setActivities(sortedData);
                } else {
                    console.error('Failed to fetch attendance data');
                }
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };

        fetchAttendance();
    }, [user.empId]);

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

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} style={{ backgroundColor: "#1B3156" }}>
            <TableContainer>
                <Table>
                    <TableHead style={{ backgroundColor: "#1B3156" }}>
                        <TableRow>
                            <TableCell style={{ color: "white" }}>Emp ID</TableCell>
                            <TableCell style={{ color: "white" }}>Date</TableCell>
                            {!isMobile && <TableCell style={{ color: "white" }}>In</TableCell>}
                            {!isMobile && <TableCell style={{ color: "white" }}>In Location</TableCell>}
                            {!isMobile && <TableCell style={{ color: "white" }}>Out</TableCell>}
                            {!isMobile && <TableCell style={{ color: "white" }}>Out Location</TableCell>}
                            <TableCell style={{ color: "white" }}>Working Hours</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ backgroundColor: "white" }} >
                        {groupedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({ date, activities }) => (
                            <React.Fragment key={date}>
                                <TableRow>
                                    <TableCell colSpan={isMobile ? 3 : 7}>
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                            {date}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                {activities.map(({ empId, firstIn, firstInLocation, lastOut, lastOutLocation, workingHours }) => (
                                    <TableRow key={`${empId}-${date}`}>
                                        <TableCell>{empId}</TableCell>
                                        <TableCell>{date}</TableCell>
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
                component="div"
                count={activities.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                style={{ color: "white" }}
            />
        </Paper>
    );
}

export default AttendanceList;
