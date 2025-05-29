"use client"

import { useState, useEffect } from "react"
import {
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useMediaQuery,
  Autocomplete,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
  Divider,
  useTheme,
  Stack,
  Avatar,
} from "@mui/material"
import {
  Download,
  Settings,
  LocationOn,
  AccessTime,
  CalendarToday,
  Person,
  Schedule,
  TrendingUp,
  Refresh,
  FilterList,
} from "@mui/icons-material"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const locales = {
  "en-US": require("date-fns/locale/en-US"),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date()),
  getDay,
  locales,
})

// Mock auth context and navigate for demo
// const useAuth = () => ({
//   user: {
//     role: "HR",
//     emp_id: "EMP001",
//     tenent_id: "TENANT001",
//     shift: "9:00 AM - 6:00 PM",
//     name: "John Doe",
//   },
// })

// const useNavigate = () => (path) => console.log(`Navigate to: ${path}`)

const generateMapUrl = (geoLocation) => {
  if (!geoLocation || geoLocation === "N/A") {
    return "#"
  }

  const [latitude, longitude] = geoLocation.split(",")

  if (!latitude || !longitude) {
    return "#"
  }

  const lat = Number.parseFloat(latitude)
  const lon = Number.parseFloat(longitude)

  if (isNaN(lat) || isNaN(lon)) {
    return "#"
  }

  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&zoom=15&basemap=satellite&markercolor=red`
}

const AttendanceStatusChip = ({ status, time }) => {
  const getStatusProps = () => {
    switch (status) {
      case "on-time":
        return { color: "success", label: "On Time" }
      case "late":
        return { color: "error", label: "Late" }
      case "early":
        return { color: "info", label: "Early" }
      default:
        return { color: "default", label: "N/A" }
    }
  }

  const { color, label } = getStatusProps()

  return (
    <Chip
      size="small"
      color={color}
      label={`${label} ${time !== "N/A" ? `(${time})` : ""}`}
      sx={{ fontSize: "0.75rem" }}
    />
  )
}

const AttendanceCard = ({ activity, isMobile }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: `4px solid ${activity.color === "green" ? theme.palette.success.main : theme.palette.error.main}`,
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
          transition: "all 0.2s ease-in-out",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday fontSize="small" color="primary" />
              <Typography variant="body2" fontWeight="medium">
                {activity.start ? format(activity.start, "dd/MM/yyyy") : "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime fontSize="small" color="success" />
              <Tooltip title={`Check-in location: ${activity.firstInLocation || "N/A"}`}>
                <Typography
                  variant="body2"
                  component="a"
                  href={generateMapUrl(activity.firstInLocation)}
                  target="_blank"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {activity.firstIn}
                </Typography>
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Schedule fontSize="small" color="warning" />
              {activity.lastOutLocation !== "N/A" ? (
                <Tooltip title={`Check-out location: ${activity.lastOutLocation}`}>
                  <Typography
                    variant="body2"
                    component="a"
                    href={generateMapUrl(activity.lastOutLocation)}
                    target="_blank"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {activity.lastOut}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {activity.lastOut}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUp fontSize="small" color="info" />
              <Typography variant="body2" fontWeight="medium">
                {activity.workingHours}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <AttendanceStatusChip status={activity.color === "green" ? "on-time" : "late"} time={activity.firstIn} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const AttendanceList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const theme = useTheme()
  const [employees, setEmployees] = useState([])
  const [selectedEmpId, setSelectedEmpId] = useState(user.role === "HR" ? "" : user.emp_id)
  const [activities, setActivities] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState("calendar") // 'calendar' or 'list'
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Mock data for demo
  // const mockEmployees = [
  //   { EmpId: "EMP001", Name: "John Doe" },
  //   { EmpId: "EMP002", Name: "Jane Smith" },
  //   { EmpId: "EMP003", Name: "Mike Johnson" },
  // ]

  // const mockActivities = [
  //   {
  //     title: "In: 9:15 AM\nOut: 6:30 PM",
  //     start: new Date(2024, 0, 15),
  //     end: new Date(2024, 0, 15),
  //     firstIn: "9:15 AM",
  //     lastOut: "6:30 PM",
  //     firstInLocation: "28.6139,77.2090",
  //     lastOutLocation: "28.6139,77.2090",
  //     workingHours: "8h 45m",
  //     allDay: true,
  //     color: "red",
  //     firstEvent: "Mobile",
  //     lastEvent: "Mobile",
  //   },
  //   {
  //     title: "In: 8:45 AM\nOut: 6:00 PM",
  //     start: new Date(2024, 0, 16),
  //     end: new Date(2024, 0, 16),
  //     firstIn: "8:45 AM",
  //     lastOut: "6:00 PM",
  //     firstInLocation: "28.6139,77.2090",
  //     lastOutLocation: "28.6139,77.2090",
  //     workingHours: "9h 15m",
  //     allDay: true,
  //     color: "green",
  //     firstEvent: "Mobile",
  //     lastEvent: "Mobile",
  //   },
  // ]

  // useEffect(() => {
  //   setEmployees(mockEmployees)
  //   setActivities(mockActivities)
  // }, [])

  const fetchAttendance = async () => {
    setError(null)
    setLoading(true)

    try {
      const response = await axios.get(
        `https://namami-infotech.com/HR-SMILE-BACKEND/src/attendance/view_attendance.php`,
        { params: { EmpId: selectedEmpId } },
      )

      if (response.data.success) {
        const attendanceData = response.data.data
          .map((activity) => {
            if (!activity.date) return null

            const formattedDate = parse(activity.date, "dd/MM/yyyy", new Date())
            if (isNaN(formattedDate)) {
              console.error("Invalid date:", activity.date)
              return null
            }

            return {
              title: (
                <>
                  In: {activity.firstIn} <br /> Out: {activity.lastOut}
                </>
              ),
              start: formattedDate,
              end: formattedDate,
              firstIn: activity.firstIn,
              lastOut: activity.lastOut,
              firstInLocation: activity.firstInLocation,
              lastOutLocation: activity.lastOutLocation,
              workingHours: activity.workingHours,
              allDay: true,
              color: compareTimes(activity.firstIn, user.shift),
              firstEvent: activity.firstEvent,
              lastEvent: activity.lastEvent,
            }
          })
          .filter(Boolean)

        setActivities(attendanceData)
      } else {
        setActivities([])
        setError("No attendance data found for the selected employee")
      }
    } catch (error) {
      setError("Error fetching attendance: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Add employee fetching for HR role
  useEffect(() => {
    if (user.role === "HR") {
      const fetchEmployees = async () => {
        try {
          setLoading(true)
          const response = await axios.get(
            `https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/list_employee.php?Tenent_Id=${user.tenent_id}`,
          )
          setEmployees(response.data.data)
        } catch (error) {
          setError("Error fetching employee list: " + error.message)
        } finally {
          setLoading(false)
        }
      }
      fetchEmployees()
    }
  }, [user.role, user.tenent_id])

  // Update the attendance fetching effect
  useEffect(() => {
    if (selectedEmpId) {
      fetchAttendance()
    }
  }, [selectedEmpId])

  const parseTime = (timeString) => {
    const [time, modifier] = timeString.split(" ")
    let [hours, minutes] = time.split(":")
    hours = String(hours)

    if (hours === "12") {
      hours = "00"
    }
    if (modifier === "PM" && hours !== "12") {
      hours = String(Number.parseInt(hours, 10) + 12)
    } else if (modifier === "AM" && hours === "12") {
      hours = "00"
    }

    return `${hours.padStart(2, "0")}:${minutes}`
  }

  const compareTimes = (attendanceTime, shiftTime) => {
    if (attendanceTime === "N/A") {
      return "red"
    }

    const shiftStartTime = parseTime(shiftTime.split(" - ")[0])
    const attendanceTime24 = parseTime(attendanceTime)

    const shiftStart = new Date(`1970-01-01T${shiftStartTime}:00`)
    const attendance = new Date(`1970-01-01T${attendanceTime24}:00`)

    const diffInMinutes = (attendance - shiftStart) / (1000 * 60)

    if (diffInMinutes <= 10) {
      return "green"
    } else {
      return "red"
    }
  }

  const exportToCsv = () => {
    const csvRows = [["Date", "Check In", "Check Out", "Working Hours", "Status"]]

    activities.forEach((activity) => {
      csvRows.push([
        activity.start ? format(activity.start, "dd/MM/yyyy") : "N/A",
        activity.firstIn,
        activity.lastOut,
        activity.workingHours,
        activity.color === "green" ? "On Time" : "Late",
      ])
    })

    const csvContent = csvRows.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute("download", `attendance_${selectedEmpId}_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.click()
    URL.revokeObjectURL(url)
  }

  const refreshData = () => {
    if (selectedEmpId) {
      fetchAttendance()
    }
    if (user.role === "HR") {
      // Refetch employees if needed
    }
  }

  const regularise = () => {
    navigate("/regularise")
  }

  // Calculate real statistics
  const totalDays = activities.length
  const onTimeDays = activities.filter((a) => a.color === "green").length
  const lateDays = activities.filter((a) => a.color === "red").length
  const avgHours =
    activities.length > 0
      ? activities.reduce((acc, activity) => {
          const hours = Number.parseFloat(activity.workingHours.replace(/[^\d.]/g, "")) || 0
          return acc + hours
        }, 0) / activities.length
      : 0

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Attendance Management
          </Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={refreshData} disabled={loading}>
                {loading ? <CircularProgress size={20} /> : <Refresh />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Controls Section */}
        <Grid container spacing={2} alignItems="center">
          {user.role === "HR" && (
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.Name} (${option.EmpId})`}
                value={employees.find((emp) => emp.EmpId === selectedEmpId) || null}
                onChange={(event, newValue) => {
                  setSelectedEmpId(newValue ? newValue.EmpId : "")
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Employee"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <Person sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Avatar sx={{ mr: 2, width: 32, height: 32 }}>{option.Name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {option.Name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.EmpId}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={4}>
            <Stack direction="row" spacing={1}>
              <Button
                variant={viewMode === "calendar" ? "contained" : "outlined"}
                onClick={() => setViewMode("calendar")}
                startIcon={<CalendarToday />}
                size="small"
              >
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "contained" : "outlined"}
                onClick={() => setViewMode("list")}
                startIcon={<FilterList />}
                size="small"
              >
                List
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {user.role === "HR" && (
                <Button variant="outlined" startIcon={<Settings />} onClick={regularise}>
                  Regularise
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={exportToCsv}
                disabled={activities.length === 0}
              >
                Export CSV
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Days
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {totalDays}
                  </Typography>
                </Box>
                <CalendarToday color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    On Time
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {onTimeDays}
                  </Typography>
                </Box>
                <AccessTime color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Late Arrivals
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    {lateDays}
                  </Typography>
                </Box>
                <Schedule color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg. Hours
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {avgHours.toFixed(2)}h
                  </Typography>
                </Box>
                <TrendingUp color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      {viewMode === "calendar" ? (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Calendar
          </Typography>
          <Calendar
            localizer={localizer}
            events={activities}
            startAccessor="start"
            endAccessor="end"
            style={{
              height: 500,
              backgroundColor: "#fff",
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.color === "green" ? theme.palette.success.main : theme.palette.error.main,
                color: "#fff",
                fontSize: "12px",
                borderRadius: "4px",
                border: "none",
                padding: "4px",
              },
            })}
            views={["month", "week", "day"]}
            popup
          />
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 2 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Records
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {isMobile ? (
              <Box>
                {activities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((activity, index) => (
                  <AttendanceCard key={index} activity={activity} isMobile={isMobile} />
                ))}
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Check In</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Check Out</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Working Hours</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((activity, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": { backgroundColor: theme.palette.action.hover },
                          borderLeft: `4px solid ${activity.color === "green" ? theme.palette.success.main : theme.palette.error.main}`,
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday fontSize="small" color="primary" />
                            {activity.start ? format(activity.start, "dd/MM/yyyy") : "N/A"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`Location: ${activity.firstInLocation || "N/A"}`}>
                            <Box
                              component="a"
                              href={generateMapUrl(activity.firstInLocation)}
                              target="_blank"
                              sx={{
                                textDecoration: "none",
                                color: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              <LocationOn fontSize="small" />
                              {activity.firstIn} ({activity.firstEvent})
                            </Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {activity.lastOutLocation !== "N/A" ? (
                            <Tooltip title={`Location: ${activity.lastOutLocation}`}>
                              <Box
                                component="a"
                                href={generateMapUrl(activity.lastOutLocation)}
                                target="_blank"
                                sx={{
                                  textDecoration: "none",
                                  color: "primary.main",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                <LocationOn fontSize="small" />
                                {activity.lastOut} ({activity.lastEvent})
                              </Box>
                            </Tooltip>
                          ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                              <Schedule fontSize="small" color="disabled" />
                              {activity.lastOut}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime fontSize="small" color="info" />
                            <Typography fontWeight="medium">{activity.workingHours}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <AttendanceStatusChip status={activity.color === "green" ? "on-time" : "late"} time="" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={activities.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(Number.parseInt(event.target.value, 10))
                setPage(0)
              }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default AttendanceList
