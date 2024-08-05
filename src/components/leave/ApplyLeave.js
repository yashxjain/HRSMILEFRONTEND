import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function ApplyLeave({ open, onClose, onLeaveApplied }) {
    const { user } = useAuth();
    const [leaveDetails, setLeaveDetails] = useState({
        EmpId: user?.emp_id || '', // Set default to an empty string if user is null
        startDate: '',
        endDate: '',
        reason: '',
        Status: 'Pending', // Default status
    });

    // Function to format the date to 'yyyy-mm-dd' for the date input fields
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Get the current date
    const today = new Date();

    // Handle field changes
    const handleChange = (field, value) => {
        setLeaveDetails({ ...leaveDetails, [field]: value });
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!user || !user.emp_id) {
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
                    inputProps={{
                        min: formatDate(today) // Minimum date is today
                    }}
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
                    inputProps={{
                        min: leaveDetails.startDate || formatDate(today) // Minimum date is the start date or today
                    }}
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
