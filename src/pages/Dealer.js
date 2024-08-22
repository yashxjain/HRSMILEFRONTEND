// src/pages/Dealer.js

import React, { useState } from 'react';
import { Box, useMediaQuery, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AddDealers from '../components/dealers/AddDealers';
import DealerList from '../components/dealers/DealerList';
import Visit from '../components/dealers/Visit';  // Import the Visit component
import VisitTable from '../components/dealers/VisitTable';

function Dealer() {
    const [isVisitOpen, setIsVisitOpen] = useState(false);
    const [isAddDealerOpen, setIsAddDealerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const drawerWidth = isMobile ? 0 : 240;

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar with fixed width */}
            <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
                <Sidebar />
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Navbar />
                <Box sx={{ mt: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsAddDealerOpen(true)}
                            sx={{ mb: 2, backgroundColor: "#1B3156" }}
                        >
                            Add Dealer
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setIsVisitOpen(true)}
                            sx={{ mb: 2, backgroundColor: "#1B3156" }}
                        >
                            Mark Visit
                        </Button>
                    </div>
                    <AddDealers open={isAddDealerOpen} onClose={() => setIsAddDealerOpen(false)} onDealerAdded={() => { }} />

                    <Visit open={isVisitOpen} onClose={() => setIsVisitOpen(false)} onVisitMarked={() => { }} />
                    <VisitTable />
                </Box>
            </Box>
        </Box>
    );
}

export default Dealer;
