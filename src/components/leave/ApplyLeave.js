import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function ApplyLeave({ open, onClose, onLeaveApplied }) {
    const { user } = useAuth();
    const [leaveDetails, setLeaveDetails] = useState({
        EmpId: user?.empId || '', // Set default to an empty string if user is null
        startDate: '',
        endDate: '',
        reason: '',
        Status: 'Pending', // Default status
    });

    const handleChange = (field, value) => {
        setLeaveDetails({ ...leaveDetails, [field]: value });
    };

    const handleSubmit = async () => {
        if (!user || !user.empId) {
            console.error('User is not authenticated');
            return;
        }

        try {
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/leave/apply_leave.php', leaveDetails);
            if (response.data.success) {
                onLeaveApplied();
                onClose();
            } else {
                console.error('Failed to apply for leave:', response.data.message);
            }
        } catch (err) {
            console.error('Error applying for leave:', err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogContent>
                <TextField
                    label="Employee ID"
                    value={leaveDetails.EmpId}
                    onChange={(e) => handleChange('EmpId', e.target.value)}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled // Disable input if empId is set by default
                />
                <TextField
                    label="Start Date"
                    type="date"
                    value={leaveDetails.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={leaveDetails.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Reason"
                    value={leaveDetails.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ApplyLeave;
