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
            <Route path="/computer-factory" element={<Login />} />
            <Route path="/computer-factory/dashboard" element={<PrivateRoute element={Dashboard} />} />
            <Route path="/computer-factory/employees" element={<PrivateRoute element={Employee} requiredRole="HR" />} />
            <Route path="/computer-factory/employees/:empId" element={<PrivateRoute element={EmployeeProfile} requiredRole="HR" />} />
            <Route path="/computer-factory/holiday" element={<PrivateRoute element={Holiday} />} />
            <Route path="/computer-factory/policy" element={<PrivateRoute element={Policy} />} />
            <Route path="/computer-factory/attendance" element={<PrivateRoute element={Attendance} />} />
            <Route path="/computer-factory/notification" element={<PrivateRoute element={Notification} />} />
            <Route path="/computer-factory/leave" element={<PrivateRoute element={Leave} />} />
            <Route path="/computer-factory/expense" element={<PrivateRoute element={Expense} />} />
            <Route path="/computer-factory/profile" element={<PrivateRoute element={EmpProfile} />} />
            <Route path="/computer-factory/travel" element={<PrivateRoute element={Travel} />} />
            <Route path="/computer-factory/ticket" element={<PrivateRoute element={Ticket} />} />
            <Route path="/computer-factory/assets" element={<PrivateRoute element={Assets} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
