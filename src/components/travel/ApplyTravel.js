import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton, CircularProgress, Snackbar } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import Alert from '@mui/material/Alert';

function ApplyTravel({ open, onClose, onTravelApplied }) {
    const { user } = useAuth();
    const [travelEntries, setTravelEntries] = useState([
        { empId: user.emp_id, expenseDate: '', expenseAmount: '', TravelDestination: '', TravelTimeFrom: '', TravelTimeTo: '', TravelReceipt: null, expenseType: 'Travel' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (index, field, value) => {
        const newEntries = [...travelEntries];
        newEntries[index][field] = value;
        setTravelEntries(newEntries);
    };

    const handleAddEntry = () => {
        setTravelEntries([...travelEntries, { empId: user.emp_id, expenseDate: '', expenseAmount: '', TravelDestination: '', TravelTimeFrom: '', TravelTimeTo: '', TravelReceipt: null, expenseType: 'Travel' }]);
    };

    const handleRemoveEntry = (index) => {
        const newEntries = travelEntries.filter((_, i) => i !== index);
        setTravelEntries(newEntries);
    };

    const handleImageChange = (index, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const newEntries = [...travelEntries];
            newEntries[index].TravelReceipt = reader.result;
            setTravelEntries(newEntries);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!user || !user.emp_id) {
            setError('User is not authenticated');
            return;
        }

        const isValid = travelEntries.every(entry => {
            return (
                entry.expenseDate &&
                !isNaN(Number(entry.expenseAmount)) &&
                entry.TravelDestination &&
                entry.TravelTimeFrom &&
                entry.TravelTimeTo
            );
        });

        if (!isValid) {
            setError('Please fill in all required fields and ensure values are correct.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Convert expenseAmount to number if needed
            const payload = {
                expenses: travelEntries.map(entry => ({
                    ...entry,
                    expenseAmount: Number(entry.expenseAmount)
                }))
            };
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/travel/apply_travel.php', payload);
            if (response.data.success) {
                setSuccess('Travel expenses applied successfully.');
                onTravelApplied();
                onClose();
            } else {
                setError(response.data.message || 'Failed to apply for travel expenses.');
            }
        } catch (err) {
            // setError('Error applying for travel expenses.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Apply for Travel Expenses</DialogTitle>
            <DialogContent>
                {travelEntries.map((entry, index) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                        <TextField
                            label="Expense Date"
                            type="date"
                            value={entry.expenseDate}
                            onChange={(e) => handleChange(index, 'expenseDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Expense Amount"
                            type="number"
                            value={entry.expenseAmount}
                            onChange={(e) => handleChange(index, 'expenseAmount', e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Travel Destination"
                            value={entry.TravelDestination}
                            onChange={(e) => handleChange(index, 'TravelDestination', e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Travel Time From"
                            type="datetime-local"
                            value={entry.TravelTimeFrom}
                            onChange={(e) => handleChange(index, 'TravelTimeFrom', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Travel Time To"
                            type="datetime-local"
                            value={entry.TravelTimeTo}
                            onChange={(e) => handleChange(index, 'TravelTimeTo', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e.target.files[0])}
                            style={{ marginTop: 10 }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                            <IconButton onClick={handleAddEntry} color="primary">
                                <AddCircleOutlineIcon />
                            </IconButton>
                            {travelEntries.length > 1 && (
                                <IconButton onClick={() => handleRemoveEntry(index)} color="secondary">
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
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

export default ApplyTravel;
