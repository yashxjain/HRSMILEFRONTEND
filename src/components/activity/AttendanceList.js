import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    useMediaQuery
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../auth/AuthContext';

const locales = {
    'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date()),
    getDay,
    locales
});

const CustomEvent = ({ event }) => (
    <div style={{ padding: '5px' }}>
        <strong>First In:</strong> {event.firstIn} <br />
        <strong>Last Out:</strong> {event.lastOut} <br />
        <strong>Hours:</strong> {event.workingHours}
    </div>
);

const generateMapUrl = (geoLocation) => {
    if (!geoLocation || geoLocation === 'N/A') {
        return '#'; // Return a dummy link or handle it as needed
    }
    const [latitude, longitude] = geoLocation.split(',');
    if (!latitude || !longitude) {
        return '#'; // Handle missing latitude or longitude
    }
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&zoom=15&basemap=satellite&markercolor=red`;
};

const AttendanceList = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [selectedEmpId, setSelectedEmpId] = useState(user.role === 'HR' ? '' : user.emp_id);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('calendar'); // State to control the view mode
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        if (user.role === 'HR') {
            const fetchEmployees = async () => {
                try {
                    const response = await axios.get('https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/list_employee.php');
                    setEmployees(response.data.data);
                } catch (error) {
                    setError('Error fetching employee list: ' + error.message);
                }
            };
            fetchEmployees();
        }
    }, [user.role]);

    useEffect(() => {
        const fetchAttendance = async () => {
            setError(null);

            try {
                const response = await axios.get(
                    `https://namami-infotech.com/HR-SMILE-BACKEND/src/attendance/view_attendance.php`,
                    { params: { EmpId: selectedEmpId } }
                );

                if (response.data.success) {
                    const attendanceData = response.data.data.map(activity => {
                        const [day, month, year] = activity.date.split('/');
                        const formattedDate = new Date(`${year}-${month}-${day}`);

                        return {
                            title: `First In: ${activity.firstIn}, Last Out: ${activity.lastOut}, Hours: ${activity.workingHours}`,
                            start: formattedDate,
                            end: formattedDate,
                            firstIn: activity.firstIn,
                            lastOut: activity.lastOut,
                            workingHours: activity.workingHours,
                            allDay: true
                        };
                    });
                    setActivities(attendanceData);
                } else {
                    setError('Failed to fetch attendance data');
                }
            } catch (error) {
                setError('Error fetching attendance: ' + error.message);
            }
        };

        if (selectedEmpId) {
            fetchAttendance();
        }
    }, [selectedEmpId]);

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
            {user.role === 'HR' && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <FormControl variant="outlined" sx={{ mb: 2, width: "200px" }}>
                        <InputLabel id="select-empId-label">Select Employee</InputLabel>
                        <Select
                            labelId="select-empId-label"
                            value={selectedEmpId}
                            onChange={(e) => setSelectedEmpId(e.target.value)}
                            label="Select Employee"
                            sx={{ borderColor: "white" }}
                        >
                            {employees.map(employee => (
                                <MenuItem key={employee.EmpId} value={employee.EmpId}>
                                    {employee.Name} ({employee.EmpId})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#1B3156", color: "white" }}
                        onClick={() => setViewMode(viewMode === 'calendar' ? 'table' : 'calendar')}
                    >
                        {viewMode === 'calendar' ? 'View in Tabular Form' : 'View in Calendar Form'}
                    </Button>
                </div>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {viewMode === 'calendar' ? (
                <div style={{ height: '600px' }}>
                    <Calendar
                        localizer={localizer}
                        events={activities}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 580, color: "#000000" }}
                        components={{ event: CustomEvent }}
                        views={{ month: true, agenda: true }}
                        defaultView="month"
                        eventPropGetter={(event) => ({
                            style: {
                                backgroundColor: '#1B3156',
                                color: '#fff',
                                fontSize: "10px"
                            }
                        })}
                        defaultDate={new Date()}
                    />
                </div>
            ) : (
                <div>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#1B3156", color: "white" }}
                        onClick={exportToCsv}
                        sx={{ m: 2 }}
                    >
                        Export to CSV
                    </Button>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                                <TableBody>
                                    {activities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((activity, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{activity.empId}</TableCell>
                                            <TableCell>{format(activity.start, 'dd/MM/yyyy')}</TableCell>
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
                </div>
            )}
        </>
    );
};

export default AttendanceList;
