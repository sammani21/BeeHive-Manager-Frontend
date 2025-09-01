import * as React from "react";
import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Tooltip,
  alpha,
  useTheme,
  Stack
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
//import axios from "axios";
import NavigationBar from "../components/NavigationBar";

// StyledTableCell component with #FFB700 color
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#FFB700",
    color: "#000000",
    fontWeight: "bold",
    fontSize: "14px",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "12px 16px",
  },
}));

// StyledTableRow component
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: alpha("#FFB700", 0.05),
  },
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
}));

// Recommendations functional component
const Recommendations: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();

const dummyBeekeepers = [
    { _id: "b1", name: "John Doe", email: "john@example.com" },
    { _id: "b2", name: "Jane Smith", email: "jane@example.com" },
  ];

  const dummyHives = [
    { _id: "h1", hiveId: "HIVE-101", beekeeperId: "b1" },
    { _id: "h2", hiveId: "HIVE-102", beekeeperId: "b1" },
    { _id: "h3", hiveId: "HIVE-201", beekeeperId: "b2" },
  ];

  const dummyRecommendations = [
    {
      _id: "r1",
      beekeeperId: { _id: "b1", name: "John Doe" },
      hiveId: { _id: "h1", hiveId: "HIVE-101" },
      category: "Health",
      message: "Check hive for mites",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "r2",
      beekeeperId: { _id: "b2", name: "Jane Smith" },
      hiveId: { _id: "h3", hiveId: "HIVE-201" },
      category: "Maintenance",
      message: "Replace broken frame",
      status: "completed",
      createdAt: new Date().toISOString(),
    },
  ];

  // State variables
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //const [recommendations, setRecommendations] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //const [allRecommendations, setAllRecommendations] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //const [beekeepers, setBeekeepers] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //const [hives, setHives] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState<boolean>(false);
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] = React.useState<string>("beekeeperName");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  //const [isLoading, setIsLoading] = React.useState<boolean>(true);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recommendations, setRecommendations] = React.useState<any[]>(dummyRecommendations);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [allRecommendations, setAllRecommendations] = React.useState<any[]>(dummyRecommendations);
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const [beekeepers, setBeekeepers] = React.useState<any[]>(dummyBeekeepers);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [hives, setHives] = React.useState<any[]>(dummyHives);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [isLoading, setIsLoading] = React.useState<boolean>(false); 
  // Form state
  const [beekeeperId, setBeekeeperId] = React.useState<string>("");
  const [hiveId, setHiveId] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("pending");

  // Fetch all data when the page loads
  /*React.useEffect(() => {
    getAllRecommendations();
    getBeekeepers();
  }, []);
*/
  // Function to get all recommendations
  /*const getAllRecommendations = () => {
    setIsLoading(true);
    setRecommendations([]);
    setAllRecommendations([]);

    axios.get("http://localhost:3000/api/v1/recommendation")
      .then((response) => {
        setRecommendations(response.data.data);
        setAllRecommendations(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
        setErrorMessage("Error fetching recommendations");
        setIsLoading(false);
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
  };*/

  // Function to handle beekeeper selection change
  /*const handleBeekeeperChange = (id: string) => {
    setBeekeeperId(id);
    getHivesByBeekeeper(id);
  };*/

  const handleBeekeeperChange = (id: string) => {
    setBeekeeperId(id);
    setHives(dummyHives.filter(hive => hive.beekeeperId === id));
  };

  // Function to handle delete button click
  const handleDeleteClick = (id: string) => {
    setSelected(id);
    setIsDeleteDialogOpen(true);
  };

  // Function to handle delete confirmation
  /*const handleDeleteConfirmation = () => {
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
  };*/

  const handleDeleteConfirmation = () => {
    setRecommendations((prev) => prev.filter((r) => r._id !== selected));
    setAllRecommendations((prev) => prev.filter((r) => r._id !== selected));
    setSuccessMessage("Recommendation deleted successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
    setIsDeleteDialogOpen(false);
  };

  // Function to handle edit button click
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /*const handleEditClick = (recommendation: any) => {
    setIsEditMode(true);
    setSelected(recommendation._id);
    setBeekeeperId(recommendation.beekeeperId._id);
    setHiveId(recommendation.hiveId._id);
    setCategory(recommendation.category);
    setMessage(recommendation.message);
    setStatus(recommendation.status);
    getHivesByBeekeeper(recommendation.beekeeperId._id);
    setIsFormDialogOpen(true);
  };*/


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = (rec: any) => {
    setIsEditMode(true);
    setSelected(rec._id);
    setBeekeeperId(rec.beekeeperId._id);
    setHiveId(rec.hiveId._id);
    setCategory(rec.category);
    setMessage(rec.message);
    setStatus(rec.status);
    setHives(dummyHives.filter((h) => h.beekeeperId === rec.beekeeperId._id));
    setIsFormDialogOpen(true);
  };


  // Function to handle status update
  /*const handleStatusUpdate = (id: string, newStatus: string) => {
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
  };*/

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
    );
    setSuccessMessage("Status updated successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Function to handle form submission
  /*const handleSubmit = () => {
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
  };*/

  const handleSubmit = () => {
    if (!beekeeperId || !hiveId || !category || !message) {
      setErrorMessage("All fields are required");
      return;
    }

    if (isEditMode) {
      setRecommendations((prev) =>
        prev.map((r) => (r._id === selected ? { ...r, status } : r))
      );
      setSuccessMessage("Recommendation updated successfully");
    } else {
      const newRec = {
        _id: `r${Math.random()}`,
        beekeeperId: beekeepers.find((b) => b._id === beekeeperId),
        hiveId: hives.find((h) => h._id === hiveId),
        category,
        message,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setRecommendations((prev) => [...prev, newRec]);
      setAllRecommendations((prev) => [...prev, newRec]);
      setSuccessMessage("Recommendation created successfully");
    }

    setTimeout(() => setSuccessMessage(""), 3000);
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
  /*const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (allRecommendations.length === 0) {
      setRecommendations([]);
      setErrorMessage("No recommendations in the database.");
      return;
    }

    const filtered = allRecommendations.filter((recommendation) => {
      switch (searchCategory) {
        case "beekeeperName":
          return recommendation.beekeeperId?.name?.toLowerCase().includes(term);
        case "hiveId":
          return recommendation.hiveId?.hiveId?.toLowerCase().includes(term);
        case "category":
          return recommendation.category?.toLowerCase().includes(term);
        case "status":
          return recommendation.status?.toLowerCase().includes(term);
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
  };*/

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = allRecommendations.filter((rec) => {
      switch (searchCategory) {
        case "beekeeperName":
          return rec.beekeeperId?.name?.toLowerCase().includes(term);
        case "hiveId":
          return rec.hiveId?.hiveId?.toLowerCase().includes(term);
        case "category":
          return rec.category?.toLowerCase().includes(term);
        case "status":
          return rec.status?.toLowerCase().includes(term);
        default:
          return false;
      }
    });
    setRecommendations(filtered);
    setErrorMessage(filtered.length === 0 ? "No results found" : "");
  };

  // Function to open create dialog
  const openCreateDialog = () => {
    setIsFormDialogOpen(true);
    setIsEditMode(false);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "dismissed":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <NavigationBar />
      
      {/* Fixed Header Section */}
      <Box sx={{ mb: 4, position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 100, pt: 2, pb: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="700" gutterBottom>
          Recommendations Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage recommendations for beekeepers and hives, track status, and provide guidance.
        </Typography>
      </Box>

      {/* Stats Card */}
      <Card sx={{ mb: 3, bgcolor: alpha("#FFB700", 0.05), position: 'sticky', top: 160, zIndex: 90 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Recommendations Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {recommendations.length} recommendations
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={`${recommendations.filter(r => r.status === "completed").length} Completed`} 
              color="success"
              variant="outlined"
            />
            <Chip 
              label={`${recommendations.filter(r => r.status === "pending").length} Pending`} 
              color="warning"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Search and Actions Section - Fixed */}
      <Card sx={{ mb: 2, position: 'sticky', top: 230, zIndex: 80 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Search by</InputLabel>
              <Select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                label="Search by"
              >
                <MenuItem value="beekeeperName">Beekeeper Name</MenuItem>
                <MenuItem value="hiveId">Hive ID</MenuItem>
                <MenuItem value="category">Category</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>

            <TextField
              placeholder="Search recommendations..."
              value={searchTerm}
              onChange={handleSearch}
              size="small"
              sx={{ minWidth: 250 }}
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
              onClick={openCreateDialog}
              sx={{ 
                backgroundColor: "#FFB700",
                '&:hover': {
                  backgroundColor: "#CC9200",
                }
              }}
            >
              Add New
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {/* Table Section - Scrollable */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : recommendations.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              p: 4,
              textAlign: 'center'
            }}>
              <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No recommendations found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'Try adjusting your search query' : 'Create a new recommendation to get started'}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 'calc(100vh - 340px)' }}>
              <Table stickyHeader aria-label="recommendations table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Beekeeper</StyledTableCell>
                    <StyledTableCell>Hive ID</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Message</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recommendations.map((row) => (
                    <StyledTableRow
                      key={row._id}
                      hover
                      sx={{ 
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {row.beekeeperId?.name || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.hiveId?.hiveId || "N/A"}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.category} 
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={row.message}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {row.message}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Select
                          value={row.status}
                          onChange={(e) => handleStatusUpdate(row._id, e.target.value)}
                          size="small"
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="dismissed">Dismissed</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {new Date(row.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton 
                            onClick={() => handleEditClick(row)}
                            color="primary"
                            size="medium"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            onClick={() => handleDeleteClick(row._id)}
                            color="error"
                            size="medium"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle fontWeight="bold">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this recommendation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmation}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              backgroundColor: "#FFB700",
              '&:hover': {
                backgroundColor: "#CC9200",
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Form Dialog */}
      <Dialog
        open={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle fontWeight="bold">
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
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setIsFormDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#FFB700",
              '&:hover': {
                backgroundColor: "#CC9200",
              }
            }}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recommendations;