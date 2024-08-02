import React from 'react';
import { Box, Typography, Paper, Avatar, Grid } from '@mui/material';
import { useAuth } from '../auth/AuthContext'; // Assuming you have an AuthContext

const UserProfile = () => {
    const { user } = useAuth(); // Get the user data from AuthContext

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4} container justifyContent="center">
                        <Avatar
                            sx={{ width: 120, height: 120 }}
                            src={user?.profilePicture || 'https://via.placeholder.com/120'}
                            alt={user?.name || 'User Profile Picture'}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h4" gutterBottom>
                            User Profile
                        </Typography>
                        <Typography variant="h6">EmpId: {user?.emp_id || 'N/A'}</Typography>
                        {/* <Typography variant="body1">{user?.empId || 'N/A'}</Typography> */}
                        <Typography variant="h6">Email:{user?.email}</Typography>
                        {/* <Typography variant="body1">{user?.email || 'N/A'}</Typography> */}
                        <Typography variant="h6">Phone:</Typography>
                        {/* <Typography variant="body1">{user?.phone || 'N/A'}</Typography> */}
                        {/* Add more fields as necessary */}
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default UserProfile;
