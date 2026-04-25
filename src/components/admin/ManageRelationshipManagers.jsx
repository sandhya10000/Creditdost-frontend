import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import api from "../../services/api.jsx";

const ManageRelationshipManagers = () => {
  const [relationshipManagers, setRelationshipManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRM, setCurrentRM] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    assignedUsers: [],
  });

  // Fetch all relationship managers
  const fetchRelationshipManagers = async () => {
    try {
      const response = await api.get("/relationship-managers");
      setRelationshipManagers(response.data);
    } catch (error) {
      showSnackbar("Error fetching relationship managers", "error");
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      showSnackbar("Error fetching users", "error");
    }
  };

  // Show snackbar message
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle user selection
  const handleUserSelection = (event) => {
    const value = event.target.value;
    setFormData({ ...formData, assignedUsers: value });
  };

  // Open dialog for creating/editing RM
  const handleOpenDialog = (rm = null) => {
    if (rm) {
      setCurrentRM(rm);
      setFormData({
        name: rm.name,
        email: rm.email,
        phone: rm.phone,
        assignedUsers: rm.assignedUsers?.map(user => user._id) || [],
      });
    } else {
      setCurrentRM(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        assignedUsers: [],
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRM(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentRM) {
        // Update existing RM
        await api.put(`/relationship-managers/${currentRM._id}`, formData);
        showSnackbar("Relationship Manager updated successfully");
      } else {
        // Create new RM
        await api.post("/relationship-managers", formData);
        showSnackbar("Relationship Manager created successfully");
      }
      
      handleCloseDialog();
      fetchRelationshipManagers();
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Error saving Relationship Manager", "error");
    }
  };

  // Handle delete RM
  const handleDeleteRM = async (rmId) => {
    if (window.confirm("Are you sure you want to delete this Relationship Manager?")) {
      try {
        await api.delete(`/relationship-managers/${rmId}`);
        showSnackbar("Relationship Manager deleted successfully");
        fetchRelationshipManagers();
      } catch (error) {
        showSnackbar(error.response?.data?.message || "Error deleting Relationship Manager", "error");
      }
    }
  };

  // Initialize component
  useEffect(() => {
    fetchRelationshipManagers();
    fetchUsers();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Relationship Managers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New RM
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="relationship managers table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Assigned Users</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {relationshipManagers.map((rm) => (
              <TableRow key={rm._id}>
                <TableCell>{rm.name}</TableCell>
                <TableCell>{rm.email}</TableCell>
                <TableCell>{rm.phone}</TableCell>
                <TableCell>
                  {rm.assignedUsers?.length || 0} users
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpenDialog(rm)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteRM(rm._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentRM ? "Edit Relationship Manager" : "Add New Relationship Manager"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {currentRM 
              ? "Update the details of the Relationship Manager." 
              : "Enter the details of the new Relationship Manager."}
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="phone"
            label="Phone Number"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Assign Users</InputLabel>
            <Select
              multiple
              value={formData.assignedUsers}
              onChange={handleUserSelection}
              input={<OutlinedInput label="Assign Users" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const user = users.find(u => u._id === value);
                    return <Chip key={value} label={user?.name || value} size="small" />;
                  })}
                </Box>
              )}
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  <Checkbox checked={formData.assignedUsers.indexOf(user._id) > -1} />
                  <ListItemText primary={user.name} secondary={user.email} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentRM ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageRelationshipManagers;