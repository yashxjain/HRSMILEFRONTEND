import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, IconButton, Grid, TablePagination, Box } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
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
        RoleId: '',
        OTP: '',
        IsOTPExpired: 1,
        IsGeofence: 0,
        Tenent_Id: null,
        IsActive: 1
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchEmployees();
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

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedEmployee(null);
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
                RoleId: employee.RoleId,
                IsActive: employee.IsActive
            });
        } else {
            setFormData({
                EmpId: '',
                Name: '',
                Mobile: '',
                EmailId: '',
                RoleId: '',
                IsActive: 1
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
            RoleId: '',
            OTP: '',
            IsOTPExpired: 1,
            IsGeofence: 0,
            Tenent_Id: null,
            IsActive: 1
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const url = formMode === 'add'
            ? 'https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/add_employee.php'
            : 'https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/edit_employee.php';

        try {
            const response = await axios.post(url, formData);
            if (response.data.success) {
                handleCloseForm();
                fetchEmployees(); // Re-fetch employees after add/edit
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDisableEmployee = async () => {
        if (!selectedEmployee) {
            console.error('No employee selected');
            return;
        }
        try {
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/disable_employee.php', { EmpId: selectedEmployee.EmpId });
            if (response.data.success) {
                handleCloseDetail();
                fetchEmployees(); // Re-fetch employees after disable
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEnableEmployee = async () => {
        if (!selectedEmployee) {
            console.error('No employee selected');
            return;
        }
        try {
            const response = await axios.post('https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/enable_employee.php', { EmpId: selectedEmployee.EmpId });
            if (response.data.success) {
                handleCloseDetail();
                fetchEmployees(); // Re-fetch employees after enable
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
                            {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                                <TableRow
                                    key={employee.EmpId}
                                    hover
                                    onClick={() => handleRowClick(employee)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{employee.EmpId}</TableCell>
                                    <TableCell>{employee.Name}</TableCell>
                                    <TableCell>{employee.Mobile}</TableCell>
                                    <TableCell>{employee.EmailId}</TableCell>
                                    <TableCell>{employee.Role}</TableCell>
                                    <TableCell>{employee.IsActive ? 'Active' : 'Inactive'}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={(e) => { e.stopPropagation(); handleOpenForm('edit', employee); }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={(e) => { e.stopPropagation(); handleDisableEmployee(); }}>
                                            <DeleteIcon />
                                        </IconButton>
                                        {employee.IsActive ? (
                                            <IconButton onClick={(e) => { e.stopPropagation(); handleDisableEmployee(); }}>
                                                <CancelIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={(e) => { e.stopPropagation(); handleEnableEmployee(); }}>
                                                <CheckIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <TablePagination
                component="div"
                count={filteredEmployees.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
            {/* Employee Detail Dialog */}
            <Dialog open={openDetail} onClose={handleCloseDetail}>
                <DialogTitle>Employee Details</DialogTitle>
                <DialogContent>
                    {selectedEmployee && (
                        <div>
                            <Typography variant="h6">Name: {selectedEmployee.Name}</Typography>
                            <Typography variant="body1">Employee ID: {selectedEmployee.EmpId}</Typography>
                            <Typography variant="body1">Mobile: {selectedEmployee.Mobile}</Typography>
                            <Typography variant="body1">Email: {selectedEmployee.EmailId}</Typography>
                            <Typography variant="body1">Role ID: {selectedEmployee.RoleId}</Typography>
                            <Typography variant="body1">Status: {selectedEmployee.IsActive ? 'Active' : 'Inactive'}</Typography>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetail} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Employee Dialog */}
            <Dialog open={openForm} onClose={handleCloseForm}>
                <DialogTitle>{formMode === 'add' ? 'Add Employee' : 'Edit Employee'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            fullWidth
                            label="Employee ID"
                            margin="normal"
                            variant="outlined"
                            value={formData.EmpId}
                            onChange={(e) => setFormData({ ...formData, EmpId: e.target.value })}
                            disabled={formMode === 'edit'}
                        />
                        <TextField
                            fullWidth
                            label="Name"
                            margin="normal"
                            variant="outlined"
                            value={formData.Name}
                            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            margin="normal"
                            variant="outlined"
                            type="password"
                            value={formData.Password}
                            onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Mobile"
                            margin="normal"
                            variant="outlined"
                            value={formData.Mobile}
                            onChange={(e) => setFormData({ ...formData, Mobile: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            margin="normal"
                            variant="outlined"
                            value={formData.EmailId}
                            onChange={(e) => setFormData({ ...formData, EmailId: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Role ID"
                            margin="normal"
                            variant="outlined"
                            type="number"
                            value={formData.RoleId}
                            onChange={(e) => setFormData({ ...formData, RoleId: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="OTP"
                            margin="normal"
                            variant="outlined"
                            value={formData.OTP}
                            onChange={(e) => setFormData({ ...formData, OTP: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Is OTP Expired"
                            margin="normal"
                            variant="outlined"
                            type="number"
                            value={formData.IsOTPExpired}
                            onChange={(e) => setFormData({ ...formData, IsOTPExpired: Number(e.target.value) })}
                        />
                        <TextField
                            fullWidth
                            label="Is Geofence"
                            margin="normal"
                            variant="outlined"
                            type="number"
                            value={formData.IsGeofence}
                            onChange={(e) => setFormData({ ...formData, IsGeofence: Number(e.target.value) })}
                        />
                        <TextField
                            fullWidth
                            label="Tenant ID"
                            margin="normal"
                            variant="outlined"
                            value={formData.Tenent_Id}
                            onChange={(e) => setFormData({ ...formData, Tenent_Id: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Status"
                            margin="normal"
                            variant="outlined"
                            type="number"
                            value={formData.IsActive}
                            onChange={(e) => setFormData({ ...formData, IsActive: Number(e.target.value) })}
                        />
                        <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }} style={{ backgroundColor: "#1B3156" }}>
                            {formMode === 'add' ? 'Add Employee' : 'Update Employee'}
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EmployeeList;
