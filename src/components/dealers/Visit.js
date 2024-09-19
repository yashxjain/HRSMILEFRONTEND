// src/components/visit/Visit.js

import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, InputLabel, Snackbar } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useGeolocated } from 'react-geolocated';

function Visit({ open, onClose, onVisitMarked }) {
    const [dealers, setDealers] = useState([]);
    const [selectedDealer, setSelectedDealer] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const { coords } = useGeolocated();

    useEffect(() => {
        if (user) {
            fetchDealers();
        }
    }, [user]);

    const fetchDealers = async () => {
        try {
            const response = await axios.get(`https://namami-infotech.com/HR-SMILE-BACKEND/src/dealer/get_dealers.php?empId=${user.emp_id}`);
            if (response.data.success) {
                setDealers(response.data.data);
            } else {
                console.error('Failed to fetch dealers');
            }
        } catch (err) {
            console.error('Error fetching dealers:', err);
        }
    };

   const handleSubmit = async () => {
    if (coords && selectedDealer) {
        const dealer = dealers.find(d => d.DealerID === selectedDealer);
        if (dealer) {
            const dealerCoords = dealer.LatLong.split(',');
            const dealerLat = parseFloat(dealerCoords[0]);
            const dealerLng = parseFloat(dealerCoords[1]);
            
            const distance = calculateDistance(coords.latitude, coords.longitude, dealerLat, dealerLng);
            console.log('Current Location:', coords.latitude, coords.longitude);
            console.log('Dealer Location:', dealerLat, dealerLng);
            console.log('Calculated distance:', distance);
            
            if (distance <= 21000) { // 100 meters
                try {
                    const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/visit/mark_visit.php', {
                        empId: user.emp_id,
                        dealerId: selectedDealer,
                        dealerName: dealer.DealerName,
                        visitLatLong: `${coords.latitude},${coords.longitude}`
                    });

                    if (response.data.success) {
                        onVisitMarked();
                        onClose();
                    } else {
                        console.error('Failed to mark visit');
                    }
                } catch (err) {
                    console.error('Error marking visit:', err);
                }
            } else {
                setError('You are not within the required location radius.');
            }
        }
    }
};


    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance * 1000; // Distance in meters
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle style={{ backgroundColor: "#1B3156", color: "white" }}>Mark Visit</DialogTitle>
            <DialogContent>
                <InputLabel fullWidth id="dealer-select-label">Select Dealer</InputLabel>
                <Select
                    labelId="dealer-select-label"
                    value={selectedDealer}
                    onChange={(e) => setSelectedDealer(e.target.value)}
                    fullWidth
                    margin="dense"
                >
                    {dealers.map(dealer => (
                        <MenuItem key={dealer.DealerID} value={dealer.DealerID}>
                            {dealer.DealerName}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                message={error}
                action={<Button color="inherit" onClick={() => setError('')}>Close</Button>}
            />
        </Dialog>
    );
}

export default Visit;
