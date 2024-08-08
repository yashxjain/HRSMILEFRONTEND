import React from 'react';
import { Grid, Card, CardContent, Typography, Divider } from '@mui/material';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Registering Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);



const DashboardData = () => {

    return (
        <Grid container spacing={3}>
            {/* Employee Statistics Card */}
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Employees</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h4">120</Typography>
                    </CardContent>
                </Card>
            </Grid>




            {/* Other Cards */}
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Other Metrics</Typography>
                        <Divider sx={{ my: 2 }} />
                        {/* Add more metrics here */}
                    </CardContent>
                </Card>
            </Grid>


        </Grid>
    );
}

export default DashboardData;
