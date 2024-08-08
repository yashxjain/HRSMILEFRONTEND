import React from 'react';
import { Box, Typography, Paper, Avatar, Grid, Divider, IconButton } from '@mui/material';
import { useAuth } from '../auth/AuthContext'; // Assuming you have an AuthContext
import EditIcon from '@mui/icons-material/Edit'; // Example icon for editing

const UserProfile = () => {
    const { user } = useAuth(); // Get the user data from AuthContext

    return (
        <Box sx={{ padding: { xs: 2, sm: 3 }, maxWidth: 800, margin: 'auto' }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4} container justifyContent="center">
                        <Avatar
                            sx={{ width: { xs: 80, sm: 120 }, height: { xs: 80, sm: 120 } }}
                            src={user?.profilePicture || 'https://via.placeholder.com/120'}
                            alt={user?.name || 'User Profile Picture'}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h4" gutterBottom>
                            {user?.username || 'N/A'} Profile
                        </Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="h6">EmpId:  {user?.emp_id || 'N/A'}</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>

                        </Typography>
                        <Typography variant="h6">Email:  {user?.email || 'N/A'}</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>

                        </Typography>
                        <Typography variant="h6">Phone:</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            {user?.phone || 'N/A'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton>
                                <EditIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default UserProfile;
