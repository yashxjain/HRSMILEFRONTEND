import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function ApplyExpense({ open, onClose, onExpenseApplied }) {
    const { user } = useAuth();
    const [expenseEntries, setExpenseEntries] = useState([
        { expenseDate: '', expenseType: '', expenseAmount: '', image: null }
    ]);

    const handleChange = (index, field, value) => {
        const newEntries = [...expenseEntries];
        newEntries[index][field] = value;
        setExpenseEntries(newEntries);
    };

    const handleAddEntry = () => {
        setExpenseEntries([...expenseEntries, { expenseDate: '', expenseType: '', expenseAmount: '', image: null }]);
    };

    const handleRemoveEntry = (index) => {
        const newEntries = expenseEntries.filter((_, i) => i !== index);
        setExpenseEntries(newEntries);
    };

    const handleSubmit = async () => {
        if (!user || !user.empId) {
            console.error('User is not authenticated');
            return;
        }

        // Validate that all required fields are filled
        const isValid = expenseEntries.every(entry => entry.expenseDate && entry.expenseType && entry.expenseAmount);
        if (!isValid) {
            console.error('Please provide valid expense data.');
            return;
        }

        try {
            const payload = {
                empId: user.empId,
                expenses: expenseEntries
            };
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/expense/apply_expense.php', payload);
            if (response.data.success) {
                onExpenseApplied();
                onClose();
            } else {
                console.error('Failed to apply for expenses:', response.data.message);
            }
        } catch (err) {
            console.error('Error applying for expenses:', err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Apply for Expenses</DialogTitle>
            <DialogContent>
                <TextField
                    label="Employee ID"
                    value={user?.empId || ''}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled
                />
                {expenseEntries.map((entry, index) => (
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
                            label="Expense Type"
                            value={entry.expenseType}
                            onChange={(e) => handleChange(index, 'expenseType', e.target.value)}
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                            <IconButton onClick={() => handleAddEntry()} color="primary">
                                <AddCircleOutlineIcon />
                            </IconButton>
                            {expenseEntries.length > 1 && (
                                <IconButton onClick={() => handleRemoveEntry(index)} color="secondary">
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            )}
                        </div>
                    </div>
                ))}
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

export default ApplyExpense;
