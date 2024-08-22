// src/components/visit/VisitTable.js

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function VisitTable() {
    const [visits, setVisits] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await axios.get(`https://namami-infotech.com/HR-SMILE-BACKEND/src/visit/view_visit.php?empId=${user.emp_id}`);
                if (response.data.success) {
                    setVisits(response.data.data);
                } else {
                    console.error('Failed to fetch visits');
                }
            } catch (err) {
                console.error('Error fetching visits:', err);
            }
        };

        fetchVisits();
    }, [user.emp_id]);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead style={{ backgroundColor: "#1B3156" }}>
                    <TableRow>
                        <TableCell style={{ color: "white" }}><Typography variant="h6">Dealer Name</Typography></TableCell>
                        <TableCell style={{ color: "white" }}><Typography variant="h6">Visit Time</Typography></TableCell>
                        <TableCell style={{ color: "white" }}><Typography variant="h6">Visit S.No</Typography></TableCell>
                        {/* <TableCell style={{ color: "white" }}><Typography variant="h6">Latitude/Longitude</Typography></TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visits.map((visit) => (
                        <TableRow key={visit.DealerID}>
                            <TableCell>{visit.DealerName}</TableCell>
                            <TableCell>{new Date(visit.VisitTime).toLocaleString()}</TableCell>
                            <TableCell>{visit.VisitCount}</TableCell>
                            {/* <TableCell>{visit.VisitLatLong}</TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default VisitTable;
