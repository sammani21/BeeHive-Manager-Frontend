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
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import NewBeekeeper, { Beekeeper } from "../components/NewBeekeeper";
import axios from "axios";
import { textAlign } from "@mui/system";
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
    textAlign,
  },
}));

// CustomSwitch component for custom styling of switches
const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: `rgba(255, 0, 0, 0.1)`,
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.error.main,
  },
}));

// Beekeepers functional component
const Beekeepers: React.FC = () => {
  // State variables
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

  // Fetch all beekeepers when the page loads
  React.useEffect(() => {
    getAllBeekeepers();
  }, []);

  // Function to get all beekeepers
  const getAllBeekeepers = () => {
    setBeekeepers([]);
    setAllBeekeepers([]);
    console.log("Fetching all beekeepers...");

    fetch("http://localhost:3000/api/v1/beekeeper")
      .then((res) => res.json())
      .then((data) => {
        setBeekeepers(data.data);
        setAllBeekeepers(data.data);
      })
      .catch((error) => {
        console.error("Error fetching beekeepers:", error);
        setErrorMessage("Error fetching beekeepers");
      });
  };

  // Function to handle click event on a table row
  const handleClick = (_event: any, id: string) => {
    const newSelected: string[] = [id];
    setSelected(newSelected);
    setErrorMessage("");
  };

  // Function to check if a row is selected
  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Function to handle delete button click
  const handleDeleteClick = (row: Beekeeper) => {
    if (selected.length === 0) {
      setErrorMessage("Please select a bee keeper to delete");
    } else {
      setIsConfirmationDialogOpen(true);
    }
  };

  // Function to handle delete confirmation
  const handleDeleteConfirmation = () => {
    setIsConfirmationDialogOpen(false);
    const b = beekeepers.filter((v) => v._id === selected[0])[0];
    axios
      .delete(`http://localhost:3000/api/v1/beekeeper/${b._id}`)
      .then((r) => {
        if (r.status === 204) {
          alert("Bee keeper deleted successfully");
          setSelected([]);
          setBeekeepers([]);
          getAllBeekeepers();
        }
      })
      .catch(() => {
        alert("Something went wrong");
      });
  };

  // Function to handle update button click
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

  // Function to close the dialog
  const closeDialog = () => {
    setIsNewBeekeeperModalOpen(false);
  };

  // Function to open the dialog
  const openDialog = () => {
    setIsNewBeekeeperModalOpen(true);
  };

  // Function to clear all fields
  const clearFields = () => {
    setNo("");
    setFName("");
    setLName("");
    setContactNo("");
    setDOfBirth(new Date());
    setGender("");
    setNIC("");
    setEmail("");
  };

  // Function to handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (allBeekeepers.length === 0) {
      setBeekeepers([]);
      setErrorMessage("No bee keepers in the database.");
      return;
    }

    const filtered = allBeekeepers.filter((beekeeper) => {
      switch (searchCategory) {
        case "no":
          return beekeeper?.no?.toLowerCase().includes(searchTerm);
        case "firstName":
          return beekeeper?.firstName?.toLowerCase().includes(searchTerm);
        case "lastName":
          return beekeeper?.lastName?.toLowerCase().includes(searchTerm);
        case "nic":
          return beekeeper?.nic?.toLowerCase().includes(searchTerm);
        case "email":
          return beekeeper?.email?.toLowerCase().includes(searchTerm);
        case "contactNo":
          return beekeeper?.contactNo?.toLowerCase().includes(searchTerm);
        case "gender":
          return beekeeper?.gender?.toLowerCase().includes(searchTerm);
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

  // Function to handle status change
  const handleStatusChange = (id: string, isActive: boolean) => {
    axios
      .put(`http://localhost:3000/api/v1/beekeeper/${id}/status`, {
        isActive: !isActive,
      })
      .then((response) => {
        console.log(
          `Beekeeper ${isActive ? "deactivated" : "activated"}:`,
          response
        );
        getAllBeekeepers();
      })
      .catch((error) => {
        console.error(
          `Error ${isActive ? "deactivating" : "activating"} beekeeper:`,
          error
        );
        setErrorMessage(
          `Error ${isActive ? "deactivating" : "activating"} beekeeper`
        );
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
          Bee Keepers
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
            onClick={() => {
              setIsNewBeekeeperModalOpen(true);
              setIsUpdate(false);
              clearFields();
            }}
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
      <br />
      <div style={{ height: "400px", overflow: "auto" }}>
        <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">No</StyledTableCell>
                <StyledTableCell align="center">
                  Date of Joined
                </StyledTableCell>
                <StyledTableCell align="center">First Name</StyledTableCell>
                <StyledTableCell align="center">Last Name</StyledTableCell>
                <StyledTableCell align="center">NIC</StyledTableCell>
                <StyledTableCell align="center">Gender</StyledTableCell>
                <StyledTableCell align="center">DOB</StyledTableCell>
                <StyledTableCell align="center">Contact No</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Availability</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {beekeepers.map((row) => {
                const isItemSelected = isSelected(row._id || "");
                return (
                  <TableRow
                    key={row._id}
                    hover
                    onClick={(event) => handleClick(event, row._id || "")}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell component="th" scope="row">
                      {row.no}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {new Date(row.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">{row.firstName}</TableCell>
                    <TableCell align="right">{row.lastName}</TableCell>
                    <TableCell align="right">{row.nic}</TableCell>
                    <TableCell align="right">{row.gender}</TableCell>
                    <TableCell align="right">
                      {new Date(row.dob).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">{row.contactNo}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>

                    <TableCell align="right">
                      <Switch
                        checked={row.availability}
                        onChange={(e) =>
                          onChangeAvailability(e.target.checked, row)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FormControlLabel
                        control={
                          <CustomSwitch
                            checked={row.isActive}
                            onChange={() =>
                              handleStatusChange(row._id || "", row.isActive)
                            }
                          />
                        }
                        label={row.isActive ? "Active" : "Inactive"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleUpdateClick(row)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(row)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <div>Are you sure you want to delete Bee Keeper?</div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsConfirmationDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmation}
            color="primary"
            startIcon={<DeleteIcon />}
          >
            Yes, delete it
          </Button>
        </DialogActions>
      </Dialog>
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
        close={closeDialog}
        open={openDialog}
      />
      <br />
    </Container>
  );
};

export default Beekeepers;
