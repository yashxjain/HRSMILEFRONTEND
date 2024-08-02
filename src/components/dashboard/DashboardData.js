import React from 'react';
import { Grid, Card, CardContent, Typography, Divider } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Registering Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
        {
            label: 'Employees',
            data: [30, 45, 60, 55, 70],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ],
};

const DashboardData = () => {
    return (
        <Grid container spacing={3}>
            {/* Employee Statistics Card */}
            <Grid item xs={12} md={6} lg={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Employees</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h4">120</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Attendance Overview Card */}
            <Grid item xs={12} md={6} lg={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Attendance Overview</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Monthly Attendance' } } }} />
                    </CardContent>
                </Card>
            </Grid>

            {/* Other Cards */}
            <Grid item xs={12} md={6} lg={4}>
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
