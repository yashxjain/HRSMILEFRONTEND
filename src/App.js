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
import EmpProfile from './pages/User';
import PrivateRoute from './components/auth/PrivateRoute';
import Travel from './pages/Travel';
import Ticket from './pages/Ticket';
import EmployeeProfile from './pages/EmployeeProfile';
import Assets from './pages/Assets';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/computer-company" element={<Login />} />
            <Route path="/computer-company/dashboard" element={<PrivateRoute element={Dashboard} />} />
            <Route path="/computer-company/employees" element={<PrivateRoute element={Employee} requiredRole="HR" />} />
            <Route path="/computer-company/employees/:empId" element={<PrivateRoute element={EmployeeProfile} requiredRole="HR" />} />
            <Route path="/computer-company/holiday" element={<PrivateRoute element={Holiday} />} />
            <Route path="/computer-company/policy" element={<PrivateRoute element={Policy} />} />
            <Route path="/computer-company/attendance" element={<PrivateRoute element={Attendance} />} />
            <Route path="/computer-company/notification" element={<PrivateRoute element={Notification} />} />
            <Route path="/computer-company/leave" element={<PrivateRoute element={Leave} />} />
            <Route path="/computer-company/expense" element={<PrivateRoute element={Expense} />} />
            <Route path="/computer-company/profile" element={<PrivateRoute element={EmpProfile} />} />
            <Route path="/computer-company/travel" element={<PrivateRoute element={Travel} />} />
            <Route path="/computer-company/ticket" element={<PrivateRoute element={Ticket} />} />
            <Route path="/computer-company/assets" element={<PrivateRoute element={Assets} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
