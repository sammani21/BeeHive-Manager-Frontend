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
  Switch,
  DialogTitle,
  styled,
  tableCellClasses,
  TextField,
  InputAdornment,
  DialogContent,
  DialogActions,
  Dialog,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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
//import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NewBeekeeper, { Beekeeper } from "../components/NewBeekeeper";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// StyledTableCell component with #FFB700 color
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

// CustomSwitch component with #FFB700 color
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#FFB700",
    "&:hover": {
      backgroundColor: alpha("#FFB700", 0.1),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#FFB700",
  },
}));

// AvailabilitySwitch component with #FFB700 color
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AvailabilitySwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#FFB700",
    "&:hover": {
      backgroundColor: alpha("#FFB700", 0.1),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#FFB700",
  },
}));

// Beekeepers functional component
const Beekeepers: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const [fName, setFName] = React.useState<string>("");
  const [lName, setLName] = React.useState<string>("");
  const [dOfBirth, setDOfBirth] = React.useState<Date>(new Date());
  const [nic, setNIC] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [contactNo, setContactNo] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");

  const [no, setNo] = React.useState<string>("");
  const [beekeepers, setBeekeepers] = React.useState<Beekeeper[]>([]);
  const [allBeekeepers, setAllBeekeepers] = React.useState<Beekeeper[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    React.useState<boolean>(false);
  const [isNewBeekeeperModalOpen, setIsNewBeekeeperModalOpen] =
    React.useState<boolean>(false);
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] = React.useState<string>("no");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [exportFormat, setExportFormat] = React.useState<string>("");

  // Fetch all beekeepers
  React.useEffect(() => {
    getAllBeekeepers();
  }, []);

  const getAllBeekeepers = () => {
    setIsLoading(true);
    setBeekeepers([]);
    setAllBeekeepers([]);
    fetch("http://localhost:3000/api/v1/beekeeper")
      .then((res) => res.json())
      .then((data) => {
        setBeekeepers(data.data);
        setAllBeekeepers(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching beekeepers:", error);
        setErrorMessage("Error fetching beekeepers");
        setIsLoading(false);
      });
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Beekeepers Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "ID",
          "Joined",
          "First Name",
          "Last Name",
          "NIC",
          "Gender",
          "DOB",
          "Contact No",
          "Email",
          "Availability",
          "Status",
        ],
      ],
      body: beekeepers.map((b) => [
        b.no ?? "",
        new Date(b.date).toLocaleDateString(),
        b.firstName ?? "",
        b.lastName ?? "",
        b.nic ?? "",
        b.gender ?? "",
        new Date(b.dob).toLocaleDateString(),
        b.contactNo ?? "",
        b.email ?? "",
        b.availability ? "Yes" : "No",
        b.isActive ? "Active" : "Inactive",
      ]),
    });

    doc.save("beekeepers-report.pdf");
  };

  // Export CSV
  const exportCSV = () => {
    const header = [
      "ID",
      "Joined",
      "First Name",
      "Last Name",
      "NIC",
      "Gender",
      "DOB",
      "Contact No",
      "Email",
      "Availability",
      "Status",
    ];
    const rows = beekeepers.map((b) => [
      b.no,
      new Date(b.date).toLocaleDateString(),
      b.firstName,
      b.lastName,
      b.nic,
      b.gender,
      new Date(b.dob).toLocaleDateString(),
      b.contactNo,
      b.email,
      b.availability ? "Yes" : "No",
      b.isActive ? "Active" : "Inactive",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "beekeepers-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle export format selection
  const handleExportFormatChange = (format: string) => {
    setExportFormat(format);
    if (format === "pdf") {
      exportPDF();
    } else if (format === "csv") {
      exportCSV();
    }
    // Reset the selection
    setTimeout(() => setExportFormat(""), 500);
  };

  // handle click/select
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (_event: any, id: string) => {
    const newSelected: string[] = [id];
    setSelected(newSelected);
    setErrorMessage("");
  };
  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // handle delete
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteClick = (row: Beekeeper) => {
    if (selected.length === 0) {
      setErrorMessage("Please select a bee keeper to delete");
    } else {
      setIsConfirmationDialogOpen(true);
    }
  };
  const handleDeleteConfirmation = () => {
    setIsConfirmationDialogOpen(false);
    const b = beekeepers.filter((v) => v._id === selected[0])[0];
    axios
      .delete(`http://localhost:3000/api/v1/beekeeper/${b._id}`)
      .then((r) => {
        if (r.status === 204) {
          setSelected([]);
          setBeekeepers([]);
          getAllBeekeepers();
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong while deleting");
      });
  };

  // update
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateClick = (row: Beekeeper) => {
    if (selected.length === 0) {
      setErrorMessage("Please select a bee keeper to update");
    } else {
      const b = beekeepers.filter((v) => v._id === selected[0])[0];
      if (b) {
        setIsNewBeekeeperModalOpen(true);
        setNo(b.no || "");
        setFName(b.firstName);
        setLName(b.lastName);
        setDOfBirth(new Date(b.dob));
        setNIC(b.nic);
        setEmail(b.email);
        setContactNo(b.contactNo);
        setGender(b.gender);
      }
    }
  };

  // search/filter
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (allBeekeepers.length === 0) {
      setBeekeepers([]);
      setErrorMessage("No bee keepers in the database.");
      return;
    }

    const filtered = allBeekeepers.filter((beekeeper) => {
      switch (searchCategory) {
        case "no":
          return beekeeper?.no?.toLowerCase().includes(term);
        case "firstName":
          return beekeeper?.firstName?.toLowerCase().includes(term);
        case "lastName":
          return beekeeper?.lastName?.toLowerCase().includes(term);
        case "nic":
          return beekeeper?.nic?.toLowerCase().includes(term);
        case "email":
          return beekeeper?.email?.toLowerCase().includes(term);
        case "contactNo":
          return beekeeper?.contactNo?.toLowerCase().includes(term);
        case "gender":
          return beekeeper?.gender?.toLowerCase().includes(term);
        default:
          return false;
      }
    });
    setBeekeepers(filtered);
    if (filtered.length === 0) {
      setErrorMessage("Cannot find the beekeeper in this category.");
    } else {
      setErrorMessage("");
    }
  };

  // status change
  const handleStatusChange = (id: string, isActive: boolean) => {
    axios
      .put(`http://localhost:3000/api/v1/beekeeper/${id}/status`, {
        isActive: !isActive,
      })
      .then(() => {
        getAllBeekeepers();
      })
      .catch(() => {
        setErrorMessage("Error updating status");
      });
  };

  const onChangeAvailability = (availability: boolean, beekeeper: Beekeeper) => {
    axios
      .put(`http://localhost:3000/api/v1/beekeeper/${beekeeper._id}`, {
        availability,
      })
      .then(() => {
        getAllBeekeepers();
      })
      .catch(() => {
        setErrorMessage("Error updating availability");
      });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <NavigationBar />
      
      {/* Fixed Header Section */}
      <Box sx={{ mb: 4, position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 100, pt: 2, pb: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="700" gutterBottom>
          Beekeepers Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all beekeepers in your system, view their details, and update their status.
        </Typography>
      </Box>

      {/* Stats Card */}
      <Card sx={{ mb: 3, bgcolor: alpha("#FFB700", 0.05), position: 'sticky', top: 160, zIndex: 90 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Beekeepers Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {beekeepers.length} beekeepers
            </Typography>
          </Box>
          <Chip 
            label={`${beekeepers.filter(b => b.isActive).length} Active`} 
            sx={{ backgroundColor: alpha("#FFB700", 0.2), color: 'text.primary' }}
            variant="outlined"
          />
        </CardContent>
      </Card>

      {/* Search and Actions Section - Fixed */}
      <Card sx={{ mb: 2, position: 'sticky', top: 230, zIndex: 80 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Search by</InputLabel>
              <Select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                label="Search by"
                size="small"
              >
                <MenuItem value="no">Bee Keeper ID</MenuItem>
                <MenuItem value="firstName">First Name</MenuItem>
                <MenuItem value="lastName">Last Name</MenuItem>
                <MenuItem value="nic">NIC</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="contactNo">Contact No</MenuItem>
                <MenuItem value="gender">Gender</MenuItem>
              </Select>
            </FormControl>

            <TextField
              placeholder="Search beekeepers..."
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
              onClick={() => {
                setIsNewBeekeeperModalOpen(true);
                setIsUpdate(false);
                setNo("");
                setFName("");
                setLName("");
                setContactNo("");
                setDOfBirth(new Date());
                setGender("");
                setNIC("");
                setEmail("");
              }}
              sx={{ 
                backgroundColor: "#FFB700",
                '&:hover': {
                  backgroundColor: "#CC9200",
                }
              }}
            >
              Add New
            </Button>

            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Export</InputLabel>
              <Select
                value={exportFormat}
                onChange={(e) => handleExportFormatChange(e.target.value)}
                label="Export"
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Table Section - Scrollable */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : beekeepers.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              p: 4,
              textAlign: 'center'
            }}>
              <VisibilityIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No beekeepers found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'Try adjusting your search query' : 'Add a new beekeeper to get started'}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 'calc(100vh - 340px)' }}>
              <Table stickyHeader aria-label="beekeepers table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Joined</StyledTableCell>
                    <StyledTableCell>First Name</StyledTableCell>
                    <StyledTableCell>Last Name</StyledTableCell>
                    <StyledTableCell>NIC</StyledTableCell>
                    <StyledTableCell>Gender</StyledTableCell>
                    <StyledTableCell>DOB</StyledTableCell>
                    <StyledTableCell>Contact No</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell align="center">Availability</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {beekeepers.map((row) => {
                    const isItemSelected = isSelected(row._id || "");
                    return (
                      <StyledTableRow
                        key={row._id}
                        hover
                        onClick={(event) => handleClick(event, row._id || "")}
                        selected={isItemSelected}
                        sx={{ 
                          '&.Mui-selected': {
                            backgroundColor: alpha("#FFB700", 0.08),
                            '&:hover': {
                              backgroundColor: alpha("#FFB700", 0.12),
                            }
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {row.no}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(row.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{row.firstName}</TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        <TableCell>{row.nic}</TableCell>
                        <TableCell>{row.gender}</TableCell>
                        <TableCell>
                          {new Date(row.dob).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{row.contactNo}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell align="center">
                          <Tooltip title={row.availability ? "Available" : "Not available"}>
                            <AvailabilitySwitch
                              checked={row.availability}
                              onChange={(e) =>
                                onChangeAvailability(e.target.checked, row)
                              }
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={row.isActive ? "Deactivate" : "Activate"}>
                            <CustomSwitch
                              checked={row.isActive}
                              onChange={() =>
                                handleStatusChange(row._id || "", row.isActive)
                              }
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => {
                                handleUpdateClick(row);
                                setIsUpdate(true);
                              }}
                              color="primary"
                              size="medium"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              onClick={() => handleDeleteClick(row)} 
                              color="error"
                              size="medium"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <Dialog
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle fontWeight="bold">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this beekeeper? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setIsConfirmationDialogOpen(false)}
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

      {/* New beekeeper modal */}
      <NewBeekeeper
        no={no}
        firstName={fName}
        lastName={lName}
        nic={nic}
        gender={gender}
        dob={dOfBirth}
        contactNo={contactNo}
        email={email}
        getAll={getAllBeekeepers}
        id={selected[0]}
        isOpen={isNewBeekeeperModalOpen}
        isUpdate={isUpdate}
        close={() => setIsNewBeekeeperModalOpen(false)}
        open={() => setIsNewBeekeeperModalOpen(true)}
      />
    </Container>
  );
};

export default Beekeepers;