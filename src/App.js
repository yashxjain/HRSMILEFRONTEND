import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import theme from './styles/theme';
import EmployeeList from './components/employee/EmployeeList';
import Employee from './pages/Employee';
import Holiday from './pages/Holiday';
import Policy from './pages/Policy';
import Attendance from './pages/Attendance';
import Notification from './pages/Notification';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employee />} />
          <Route path="/holiday" element={<Holiday />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/notification" element={<Notification />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
