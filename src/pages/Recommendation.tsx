import * as React from "react";
import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  DialogTitle,
  styled,
  tableCellClasses,
  TextField,
  InputAdornment,
  DialogContent,
  DialogActions,
  Dialog,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  //Typography,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";

// StyledTableCell component for custom styling of table cells
export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#FFD700",
    color: "#000000",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Recommendations functional component
const Recommendations: React.FC = () => {
  // State variables
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recommendations, setRecommendations] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allRecommendations, setAllRecommendations] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [beekeepers, setBeekeepers] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hives, setHives] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState<boolean>(false);
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] = React.useState<string>("beekeeperName");
  const [successMessage, setSuccessMessage] = React.useState<string>("");

  // Form state
  const [beekeeperId, setBeekeeperId] = React.useState<string>("");
  const [hiveId, setHiveId] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("pending");

  // Fetch all data when the page loads
  React.useEffect(() => {
    getAllRecommendations();
    getBeekeepers();
  }, []);

  // Function to get all recommendations
  const getAllRecommendations = () => {
    setRecommendations([]);
    setAllRecommendations([]);

    axios.get("http://localhost:3000/api/v1/recommendation")
      .then((response) => {
        setRecommendations(response.data.data);
        setAllRecommendations(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
        setErrorMessage("Error fetching recommendations");
      });
  };

  // Function to get all beekeepers
  const getBeekeepers = () => {
    axios.get("http://localhost:3000/api/v1/beekeeper")
      .then((response) => {
        setBeekeepers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching beekeepers:", error);
        setErrorMessage("Error fetching beekeepers");
      });
  };

  // Function to get hives by beekeeper
  const getHivesByBeekeeper = (no: string) => {
    axios.get(`http://localhost:3000/api/v1/recommendation/hives/${no}`)
      .then((response) => {
        setHives(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching hives:", error);
        setErrorMessage("Error fetching hives");
      });
  };

  // Function to handle beekeeper selection change
  const handleBeekeeperChange = (id: string) => {
    setBeekeeperId(id);
    getHivesByBeekeeper(id);
  };

  // Function to handle delete button click
  const handleDeleteClick = (id: string) => {
    setSelected(id);
    setIsDeleteDialogOpen(true);
  };

  // Function to handle delete confirmation
  const handleDeleteConfirmation = () => {
    setIsDeleteDialogOpen(false);
    axios.delete(`http://localhost:3000/api/v1/recommendation/${selected}`)
      .then((response) => {
        if (response.status === 200) {
          setSuccessMessage("Recommendation deleted successfully");
          setTimeout(() => setSuccessMessage(""), 3000);
          getAllRecommendations();
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong");
      });
  };

  // Function to handle edit button click
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = (recommendation: any) => {
    setIsEditMode(true);
    setSelected(recommendation._id);
    setBeekeeperId(recommendation.beekeeperId._id);
    setHiveId(recommendation.hiveId._id);
    setCategory(recommendation.category);
    setMessage(recommendation.message);
    setStatus(recommendation.status);
    getHivesByBeekeeper(recommendation.beekeeperId._id);
    setIsFormDialogOpen(true);
  };

  // Function to handle status update
  const handleStatusUpdate = (id: string, newStatus: string) => {
    axios.put(`http://localhost:3000/api/v1/recommendation/${id}/status`, { status: newStatus })
      .then((response) => {
        if (response.status === 200) {
          setSuccessMessage("Status updated successfully");
          setTimeout(() => setSuccessMessage(""), 3000);
          getAllRecommendations();
        }
      })
      .catch(() => {
        setErrorMessage("Error updating status");
      });
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (!beekeeperId || !hiveId || !category || !message) {
      setErrorMessage("All fields are required");
      return;
    }

    if (isEditMode) {
      // For simplicity, we'll only update status in edit mode
      // If you need to update other fields, you'll need to create a new endpoint
      handleStatusUpdate(selected, status);
    } else {
      axios.post("http://localhost:3000/api/v1/recommendation", {
        beekeeperId,
        hiveId,
        category,
        message
      })
      .then((response) => {
        if (response.status === 201) {
          setSuccessMessage("Recommendation created successfully");
          setTimeout(() => setSuccessMessage(""), 3000);
          getAllRecommendations();
        }
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || "Something went wrong");
      });
    }

    setIsFormDialogOpen(false);
    resetForm();
  };

  // Function to reset form
  const resetForm = () => {
    setBeekeeperId("");
    setHiveId("");
    setCategory("");
    setMessage("");
    setStatus("pending");
    setIsEditMode(false);
    setSelected("");
  };

  // Function to handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (allRecommendations.length === 0) {
      setRecommendations([]);
      setErrorMessage("No recommendations in the database.");
      return;
    }

    const filtered = allRecommendations.filter((recommendation) => {
      switch (searchCategory) {
        case "beekeeperName":
          return recommendation.beekeeperId?.name?.toLowerCase().includes(searchTerm);
        case "hiveId":
          return recommendation.hiveId?.hiveId?.toLowerCase().includes(searchTerm);
        case "category":
          return recommendation.category?.toLowerCase().includes(searchTerm);
        case "status":
          return recommendation.status?.toLowerCase().includes(searchTerm);
        default:
          return false;
      }
    });
    setRecommendations(filtered);
    if (filtered.length === 0) {
      setErrorMessage("Cannot find any recommendations in this category.");
    } else {
      setErrorMessage("");
    }
  };

  // Function to open create dialog
  const openCreateDialog = () => {
    setIsFormDialogOpen(true);
    setIsEditMode(false);
    resetForm();
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: "-60px", width: "91vw" }}>
      <br />
      <br />
      <NavigationBar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle sx={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
          Recommendations
        </DialogTitle>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Search by</InputLabel>
            <Select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              label="Search by"
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="beekeeperName">Beekeeper Name</MenuItem>
              <MenuItem value="hiveId">Hive ID</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>

          <TextField
            placeholder="Search..."
            onChange={handleSearch}
            sx={{
              borderRadius: "8px",
              minWidth: "250px",
              "& .MuiInputBase-root": { paddingRight: "10px" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              backgroundColor: "#FFB700",
              "&:hover": {
                backgroundColor: "#CC9200",
              },
            }}
            onClick={openCreateDialog}
          >
            Add New
          </Button>
        </div>
      </div>
      {errorMessage && (
        <Alert severity="error" sx={{ marginTop: "10px" }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ marginTop: "10px" }}>
          {successMessage}
        </Alert>
      )}
      <br />
      <div style={{ height: "400px", overflow: "auto" }}>
        <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Beekeeper</StyledTableCell>
                <StyledTableCell align="center">Hive ID</StyledTableCell>
                <StyledTableCell align="center">Category</StyledTableCell>
                <StyledTableCell align="center">Message</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Created At</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recommendations.map((row) => (
                <TableRow
                  key={row._id}
                  hover
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="right">
                    {row.beekeeperId?.name || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {row.hiveId?.hiveId || "N/A"}
                  </TableCell>
                  <TableCell align="right">{row.category}</TableCell>
                  <TableCell align="right">{row.message}</TableCell>
                  <TableCell align="right">
                    <Select
                      value={row.status}
                      onChange={(e) => handleStatusUpdate(row._id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="dismissed">Dismissed</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      onClick={() => handleEditClick(row)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteClick(row._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <div>Are you sure you want to delete this recommendation?</div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmation}
            color="error"
            startIcon={<DeleteIcon />}
          >
            Yes, delete it
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Form Dialog */}
      <Dialog
        open={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? "Edit Recommendation" : "Create New Recommendation"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Beekeeper</InputLabel>
              <Select
                value={beekeeperId}
                onChange={(e) => handleBeekeeperChange(e.target.value)}
                label="Beekeeper"
                disabled={isEditMode}
              >
                {beekeepers.map((beekeeper) => (
                  <MenuItem key={beekeeper._id} value={beekeeper._id}>
                    {beekeeper.name} ({beekeeper.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Hive</InputLabel>
              <Select
                value={hiveId}
                onChange={(e) => setHiveId(e.target.value)}
                label="Hive"
                disabled={isEditMode}
              >
                {hives.map((hive) => (
                  <MenuItem key={hive._id} value={hive._id}>
                    {hive.hiveId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                disabled={isEditMode}
              >
                <MenuItem value="Health">Health</MenuItem>
                <MenuItem value="Productivity">Productivity</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={4}
              disabled={isEditMode}
            />

            {isEditMode && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="dismissed">Dismissed</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsFormDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <br />
    </Container>
  );
};

export default Recommendations;