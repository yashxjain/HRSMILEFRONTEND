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
import Expense from './pages/Expense';
import EmpProfile from './pages/EmpProfile';
import PrivateRoute from './components/auth/PrivateRoute';
import Travel from './pages/Travel';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
            <Route path="/employees" element={<PrivateRoute element={Employee} />} />
            <Route path="/holiday" element={<PrivateRoute element={Holiday} />} />
            <Route path="/policy" element={<PrivateRoute element={Policy} />} />
            <Route path="/attendance" element={<PrivateRoute element={Attendance} />} />
            <Route path="/notification" element={<PrivateRoute element={Notification} />} />
            <Route path="/leave" element={<PrivateRoute element={Leave} />} />
            <Route path="/expense" element={<PrivateRoute element={Expense} />} />
            <Route path="/profile" element={<PrivateRoute element={EmpProfile} />} />
            <Route path="/travel" element={<PrivateRoute element={Travel} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
