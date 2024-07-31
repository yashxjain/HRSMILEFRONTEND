import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

function ViewNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('https://namami-infotech.com/HR-SMILE-BACKEND/src/notification/get_notification.php');
                setNotifications(response.data.notifications);
            } catch (err) {
                setError('Failed to fetch notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Body</TableCell>
                        <TableCell>URL</TableCell>
                        <TableCell>Push Time</TableCell>
                        <TableCell>Image</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notifications.map((notification) => (
                        <TableRow key={notification.id}>
                            <TableCell>{notification.subject}</TableCell>
                            <TableCell>{notification.body}</TableCell>
                            <TableCell>
                                <a href={notification.url} target="_blank" rel="noopener noreferrer">{notification.url}</a>
                            </TableCell>
                            <TableCell>{notification.push_time}</TableCell>
                            <TableCell>
                                {notification.image && <img src={notification.image} alt="Notification" style={{ width: '100px', height: 'auto' }} />}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ViewNotifications;
