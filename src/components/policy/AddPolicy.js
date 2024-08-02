import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';

function AddPolicyDialog({ open, onClose, onPolicyAdded }) {
    const [policyName, setPolicyName] = useState('');
    const [policyDescription, setPolicyDescription] = useState('');
    const [policyFile, setPolicyFile] = useState(null); // State to store the selected file

    const handleFileChange = (e) => {
        setPolicyFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!policyFile) {
            alert('Please select a PDF file.');
            return;
        }

        try {
            // Prepare the form data
            const formData = new FormData();
            formData.append('file', policyFile);
            formData.append('PolicyName', policyName);
            formData.append('PolicyDescription', policyDescription);

            // Upload the file to the server
            const response = await axios.post(
                'https://namami-infotech.com/HR-SMILE-BACKEND/src/policy/upload_policy.php', // Your backend endpoint
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                const policyURL = response.data.fileUrl; // URL returned from the server after upload
                // Save policy details with the file URL
                await axios.post(
                    'https://namami-infotech.com/HR-SMILE-BACKEND/src/policy/add_policy.php',
                    {
                        PolicyName: policyName,
                        PolicyDescription: policyDescription,
                        PolicyURL: policyURL
                    }
                );
                onPolicyAdded(); // Refresh the list
                setPolicyName('');
                setPolicyDescription('');
                setPolicyFile(null);
                onClose();
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error adding policy:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Policy</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                    <input
                        accept="image/*,application/pdf"
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
