import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './components/auth/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import theme from './styles/theme';
import Employee from './pages/Employee';
import Holiday from './pages/Holiday';
import Policy from './pages/Policy';
import Attendance from './pages/Attendance';
import Notification from './pages/Notification';
import Leave from './pages/Leave';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/holiday" element={<Holiday />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/leave" element={<Leave />} />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
