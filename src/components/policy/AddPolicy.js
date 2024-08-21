import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';

function AddPolicyDialog({ open, onClose, onPolicyAdded }) {
    const [policyName, setPolicyName] = useState('');
    const [policyDescription, setPolicyDescription] = useState('');
    const [policyURL, setPolicyURL] = useState(''); // State to store the policy URL
    const [pdfBase64, setPdfBase64] = useState(''); // State to store the base64 encoded PDF

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPdfBase64(reader.result.split(',')[1]); // Remove the base64 prefix
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pdfBase64 || !policyURL) {
            alert('Please provide a PDF file and a policy URL.');
            return;
        }

        try {
            const response = await axios.post(
                'https://namami-infotech.com/CFBackend/src/policy/add_policy.php',
                {
                    PolicyName: policyName,
                    PolicyDescription: policyDescription,
                    PolicyURL: policyURL,
                    PolicyPDF: pdfBase64
                }
            );

            if (response.data.success) {
                onPolicyAdded(); // Refresh the list
                setPolicyName('');
                setPolicyDescription('');
                setPolicyURL('');
                setPdfBase64('');
                onClose();
            } else {
                console.error('Failed to add policy:', response.data.message);
            }
        } catch (error) {
            console.error('Error adding policy:', error);
        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle style={{ backgroundColor: "#1B3156", color: "white" }}>Add Policy</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Policy Name"
                        margin="normal"
                        variant="outlined"
                        value={policyName}
                        onChange={(e) => setPolicyName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Policy Description"
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={policyDescription}
                        onChange={(e) => setPolicyDescription(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Policy URL"
                        margin="normal"
                        variant="outlined"
                        value={policyURL}
                        onChange={(e) => setPolicyURL(e.target.value)}
                    />
                    <input
                        accept="application/pdf"
                        type="file"
                        onChange={handleFileChange}
                        style={{ marginTop: '16px', marginBottom: '16px' }}
                    />

                    <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }}>
                        Add Policy
                    </Button>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddPolicyDialog;
