import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    IconButton,
    Grid,
    TablePagination,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [offices, setOffices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
        OfficeId: null,
        OfficeName: '',
        LatLong: '',
        Distance: '',
        OfficeIsActive: 1,
        RM: '',
        Shift: ''
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
                Password: '',
                Mobile: employee.Mobile,
                EmailId: employee.EmailId,
                Role: employee.Role,
                OTP: employee.OTP,
                IsOTPExpired: employee.IsOTPExpired || 1,
                IsGeofence: employee.IsGeofence || 0,
                Tenent_Id: employee.Tenent_Id || null,
                IsActive: employee.IsActive || 1,
                OfficeId: employee.OfficeId || null,
                OfficeName: employee.OfficeName || '',
                LatLong: employee.LatLong || '',
                Distance: employee.Distance || '',
                OfficeIsActive: employee.OfficeIsActive || 1,
                RM: employee.RM,
                Shift: employee.Shift
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
                OfficeId: null,
                OfficeName: '',
                LatLong: '',
                Distance: '',
                OfficeIsActive: 1,
                RM: '',
                Shift: ''
            });
        }
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Ensure all required fields are populated
        const requiredFields = ['EmpId', 'Name', 'Password', 'Mobile', 'EmailId', 'Role', 'OfficeName', 'LatLong', 'Distance'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                alert(`Please fill in all required fields. Missing: ${field}`);
                return;
            }
        }

        const formattedFormData = {
            ...formData,
            OTP: formData.OTP || '123456', // Provide a default OTP if not provided
            Tenent_Id: formData.Tenent_Id || 123 // Provide a default Tenant ID if not provided
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

    const filteredEmployees = employees.filter(employee => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return Object.keys(employee).some(key =>
            employee[key].toString().toLowerCase().includes(lowerCaseSearchTerm)
        );
    });


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
                                <TableCell style={{ color: "white" }}>RM</TableCell>
                                <TableCell style={{ color: "white" }}>Shift</TableCell>
                                <TableCell style={{ color: "white" }}>Status</TableCell>
                                <TableCell style={{ color: "white" }}>Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(employee => (

                                <TableRow key={employee.EmpId}>

                                    <TableCell component={Link} to={employee.EmpId} style={{ textDecoration: 'none' }}>{employee.EmpId}</TableCell>

                                    <TableCell component={Link} to={employee.EmpId} style={{ textDecoration: 'none' }}>{employee.Name}</TableCell>
                                    <TableCell component={Link} to={employee.EmpId} style={{ textDecoration: 'none' }}>{employee.Mobile}</TableCell>
                                    <TableCell component={Link} to={employee.EmpId} style={{ textDecoration: 'none' }}>{employee.EmailId}</TableCell>
                                    <TableCell component={Link} to={employee.EmpId} style={{ textDecoration: 'none' }}>{employee.Role}</TableCell>
                                    <TableCell>{employee.RM}</TableCell>
                                    <TableCell>{employee.Shift}</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color={employee.IsActive ? "green" : "red"}
                                        >
                                            {employee.IsActive ? 'Active' : 'Inactive'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenForm('edit', employee)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDisableEmployee(employee)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>

                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredEmployees.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <Dialog open={openForm} onClose={handleCloseForm}>
                <DialogTitle>{formMode === 'add' ? 'Add Employee' : 'Edit Employee'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleFormSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Employee ID"
                                    value={formData.EmpId}
                                    onChange={(e) => setFormData({ ...formData, EmpId: e.target.value })}
                                    required
                                    disabled={formMode === 'edit'}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={formData.Name}
                                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={formData.Password}
                                    onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Mobile"
                                    value={formData.Mobile}
                                    onChange={(e) => setFormData({ ...formData, Mobile: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={formData.EmailId}
                                    onChange={(e) => setFormData({ ...formData, EmailId: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Role"
                                    value={formData.Role}
                                    onChange={(e) => setFormData({ ...formData, Role: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="RM"
                                    value={formData.RM}
                                    onChange={(e) => setFormData({ ...formData, RM: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Shift</InputLabel>
                                    <Select
                                        value={formData.Shift}
                                        onChange={(e) => setFormData({ ...formData, Shift: e.target.value })}
                                        label="Shift"
                                    >
                                        <MenuItem value="9 AM - 6 PM">9 AM - 6 PM</MenuItem>
                                        <MenuItem value="9:30 AM - 6:30 PM">9:30 AM - 6:30 PM</MenuItem>
                                        <MenuItem value="10 AM - 7 PM">10 AM - 7 PM</MenuItem>
                                        <MenuItem value="11 AM - 8 PM">11 AM - 8 PM</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Office</InputLabel>
                                    <Select
                                        value={formData.OfficeId || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            OfficeId: e.target.value,
                                            OfficeName: offices.find(o => o.Id === e.target.value)?.OfficeName || '',
                                            LatLong: offices.find(o => o.Id === e.target.value)?.LatLong || '',
                                            Distance: offices.find(o => o.Id === e.target.value)?.Distance || ''
                                        })}
                                        required
                                    >
                                        {offices.map(office => (
                                            <MenuItem key={office.Id} value={office.Id}>
                                                {office.OfficeName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Latitude/Longitude"
                                    value={formData.LatLong}
                                    onChange={(e) => setFormData({ ...formData, LatLong: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Distance"
                                    value={formData.Distance}
                                    onChange={(e) => setFormData({ ...formData, Distance: e.target.value })}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button onClick={handleCloseForm} color="primary">Cancel</Button>
                            <Button type="submit" color="primary">Submit</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={openDetail} onClose={handleCloseDetail}>
                <DialogTitle>Employee Details</DialogTitle>
                <DialogContent>
                    {/* You can add employee details here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetail} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}

export default EmployeeList;
