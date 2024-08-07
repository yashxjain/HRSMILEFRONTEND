import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, IconButton, Grid, TablePagination, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [offices, setOffices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
    const [formData, setFormData] = useState({
        EmpId: '',
        Name: '',
        Password: '',
        Mobile: '',
        EmailId: '',
        Role: '',
        OTP: '',
        IsOTPExpired: 1,
        IsGeofence: 0,
        Tenent_Id: null,
        IsActive: 1,
        OfficeName: '',
        LatLong: '',
        Distance: '',
        OfficeIsActive: 1
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchEmployees();
        fetchOffices();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/list_employee.php');
            if (response.data.success) {
                setEmployees(response.data.data);
            } else {
                console.error('Error fetching employees:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchOffices = async () => {
        try {
            const response = await axios.get('https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/get_office.php');
            if (response.data.success) {
                setOffices(response.data.data);
            } else {
                console.error('Error fetching offices:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching offices:', error);
        }
    };

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenForm = (mode, employee = null) => {
        setFormMode(mode);
        if (mode === 'edit' && employee) {
            setFormData({
                EmpId: employee.EmpId,
                Name: employee.Name,
                Mobile: employee.Mobile,
                EmailId: employee.EmailId,
                Role: employee.Role,
                IsActive: employee.IsActive,
                OfficeName: employee.OfficeName || '',
                LatLong: employee.LatLong || '',
                Distance: employee.Distance || '',
                OfficeIsActive: employee.OfficeIsActive || 1
            });
        } else {
            setFormData({
                EmpId: '',
                Name: '',
                Password: '',
                Mobile: '',
                EmailId: '',
                Role: '',
                OTP: '',
                IsOTPExpired: 1,
                IsGeofence: 0,
                Tenent_Id: null,
                IsActive: 1,
                OfficeName: '',
                LatLong: '',
                Distance: '',
                OfficeIsActive: 1
            });
        }
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setFormData({
            EmpId: '',
            Name: '',
            Password: '',
            Mobile: '',
            EmailId: '',
            Role: '',
            OTP: '',
            IsOTPExpired: 1,
            IsGeofence: 0,
            Tenent_Id: null,
            IsActive: 1,
            OfficeName: '',
            LatLong: '',
            Distance: '',
            OfficeIsActive: 1
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const defaultValues = {
            EmpId: 'ss03',
            Name: 'John Doe',
            Password: 'password123',
            Mobile: '9876543210',
            EmailId: 'john.doe@example.com',
            Role: 'Employee',
            OTP: '123456',
            IsOTPExpired: 0,
            IsGeofence: 1,
            Tenent_Id: 123,
            IsActive: 1,
            OfficeName: 'Main Office',
            LatLong: '28.6562,77.2415',
            Distance: 500,
            OfficeIsActive: 1
        };

        const formattedFormData = {
            ...defaultValues,
            ...formData,
            OTP: formData.OTP || defaultValues.OTP,
            Distance: formData.Distance || defaultValues.Distance,
            Tenent_Id: formData.Tenent_Id || defaultValues.Tenent_Id
        };

        const url = formMode === 'add'
            ? 'https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/add_employee.php'
            : 'https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/edit_employee.php';

        try {
            const response = await axios.post(url, formattedFormData);
            if (response.data.success) {
                handleCloseForm();
                fetchEmployees();
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDisableEmployee = async (employee) => {
        if (!employee || !employee.EmpId) {
            console.error('Please provide both Employee ID and action');
            return;
        }
        try {
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/disable_employee.php', {
                EmpId: employee.EmpId,
                action: 'disable'
            });
            if (response.data.success) {
                fetchEmployees();
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEnableEmployee = async (employee) => {
        if (!employee || !employee.EmpId) {
            console.error('Please provide both Employee ID and action');
            return;
        }
        try {
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/disable_employee.php', {
                EmpId: employee.EmpId,
                action: 'enable'
            });
            if (response.data.success) {
                fetchEmployees();
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search Employee"
                        margin="normal"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: "#1B3156" }}
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenForm('add')}
                    >
                        Add Employee
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ overflowX: 'auto', mt: 2 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead style={{ backgroundColor: "#1B3156" }}>
                            <TableRow>
                                <TableCell style={{ color: "white" }}>Employee ID</TableCell>
                                <TableCell style={{ color: "white" }}>Name</TableCell>
                                <TableCell style={{ color: "white" }}>Mobile</TableCell>
                                <TableCell style={{ color: "white" }}>Email</TableCell>
                                <TableCell style={{ color: "white" }}>Role</TableCell>
                                <TableCell style={{ color: "white" }}>Status</TableCell>
                                <TableCell style={{ color: "white" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(employee => (
                                <TableRow key={employee.EmpId}>
                                    <TableCell>{employee.EmpId}</TableCell>
                                    <TableCell>{employee.Name}</TableCell>
                                    <TableCell>{employee.Mobile}</TableCell>
                                    <TableCell>{employee.EmailId}</TableCell>
                                    <TableCell>{employee.Role}</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color={employee.IsActive ? "green" : "red"}
                                        >
                                            {employee.IsActive ? 'Active' : 'Inactive'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenForm('edit', employee)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDisableEmployee(employee)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Employee Detail Dialog */}
            {selectedEmployee && (
                <Dialog open={openDetail} onClose={handleCloseDetail}>
                    <DialogTitle>Employee Details</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1"><strong>Employee ID:</strong> {selectedEmployee.EmpId}</Typography>
                        <Typography variant="body1"><strong>Name:</strong> {selectedEmployee.Name}</Typography>
                        <Typography variant="body1"><strong>Mobile:</strong> {selectedEmployee.Mobile}</Typography>
                        <Typography variant="body1"><strong>Email:</strong> {selectedEmployee.EmailId}</Typography>
                        <Typography variant="body1"><strong>Role:</strong> {selectedEmployee.Role}</Typography>
                        <Typography variant="body1"><strong>Status:</strong> {selectedEmployee.IsActive ? 'Active' : 'Inactive'}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDetail} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Employee Form Dialog */}
            <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
                <DialogTitle>{formMode === 'add' ? 'Add Employee' : 'Edit Employee'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Employee ID"
                            variant="outlined"
                            value={formData.EmpId}
                            onChange={(e) => setFormData({ ...formData, EmpId: e.target.value })}
                            disabled={formMode === 'edit'}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Name"
                            variant="outlined"
                            value={formData.Name}
                            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={formData.Password}
                            onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Mobile"
                            variant="outlined"
                            value={formData.Mobile}
                            onChange={(e) => setFormData({ ...formData, Mobile: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            variant="outlined"
                            value={formData.EmailId}
                            onChange={(e) => setFormData({ ...formData, EmailId: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Role"
                            variant="outlined"
                            value={formData.Role}
                            onChange={(e) => setFormData({ ...formData, Role: e.target.value })}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Office</InputLabel>
                            <Select
                                value={formData.OfficeName}
                                onChange={(e) => setFormData({ ...formData, OfficeName: e.target.value })}
                            >
                                {offices.map(office => (
                                    <MenuItem key={office.Id} value={office.OfficeName}>
                                        {office.OfficeName}
                                        {/* {office.LatLong} */}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* <TextField
                            fullWidth
                            margin="normal"
                            label="Latitude & Longitude"
                            variant="outlined"
                            value={formData.LatLong}
                            onChange={(e) => setFormData({ ...formData, LatLong: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Distance"
                            variant="outlined"
                            type="number"
                            value={formData.Distance}
                            onChange={(e) => setFormData({ ...formData, Distance: e.target.value })}
                        /> */}
                        {/* <FormControl fullWidth margin="normal">
                            <InputLabel>Office Status</InputLabel>
                            <Select
                                value={formData.OfficeIsActive}
                                onChange={(e) => setFormData({ ...formData, OfficeIsActive: e.target.value })}
                            >
                                <MenuItem value={1}>Active</MenuItem>
                                <MenuItem value={0}>Inactive</MenuItem>
                            </Select>
                        </FormControl> */}
                        <DialogActions>
                            <Button onClick={handleCloseForm} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" variant="contained">
                                {formMode === 'add' ? 'Add' : 'Save'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EmployeeList;
