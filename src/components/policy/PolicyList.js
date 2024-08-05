import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import AddPolicyDialog from './AddPolicy';

function PolicyList() {
    const [policies, setPolicies] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const fetchPolicies = async () => {
        try {
            const response = await axios.get('https://namami-infotech.com/HR-SMILE-BACKEND/src/policy/view_policy.php');
            if (response.data.success) {
                setPolicies(response.data.data);
            } else {
                console.error('Failed to fetch policies:', response.data.message);
            }
        } catch (err) {
            console.error('Error fetching policies:', err);
        }
    };

    const handleTogglePolicyStatus = async (policyId, action) => {
        try {
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/policy/disable_policy.php', { PolicyId: policyId, action });
            if (response.data.success) {
                fetchPolicies(); // Refresh the list
            } else {
                console.error(`Failed to ${action} policy:`, response.data.message);
            }
        } catch (err) {
            console.error(`Error ${action}ing policy:`, err);
        }
    };

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);
    const handlePolicyAdded = () => fetchPolicies(); // Refresh the list

    useEffect(() => {
        fetchPolicies();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewPDF = (pdfBase64) => {
        try {
            const byteCharacters = atob(pdfBase64); // Decode base64
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            window.open(url, '_blank');
        } catch (error) {
            console.error('Error opening PDF:', error);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mb: 2 }} style={{ backgroundColor: "#1B3156" }}>
                Add Policy
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead style={{ backgroundColor: "#1B3156" }}>
                        <TableRow>
                            <TableCell style={{ color: "white" }}>Policy Name</TableCell>
                            <TableCell style={{ color: "white" }}>Description</TableCell>
                            <TableCell style={{ color: "white" }}>URL</TableCell>
                            <TableCell style={{ color: "white" }}>View</TableCell>
                            <TableCell style={{ color: "white" }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {policies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((policy) => (
                            <TableRow key={policy.PolicyId}>
                                <TableCell>{policy.PolicyName}</TableCell>
                                <TableCell>{policy.PolicyDescription}</TableCell>
                                <TableCell>
                                    <a href={policy.PolicyURL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "blue" }}>
                                        {policy.PolicyName}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewPDF(policy.PolicyPDF)}
                                    >
                                        View PDF
                                    </Button>

                                </TableCell>
                                <TableCell>
                                    {policy.IsActive ? (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleTogglePolicyStatus(policy.Id, 'disable')}
                                        >
                                            Disable
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleTogglePolicyStatus(policy.Id, 'enable')}
                                        >
                                            Enable
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={policies.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
            <AddPolicyDialog open={dialogOpen} onClose={handleCloseDialog} onPolicyAdded={handlePolicyAdded} />
        </div>
    );
}

export default PolicyList;
