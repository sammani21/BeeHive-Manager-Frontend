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
  TextField,
  //IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  styled,
  tableCellClasses,
  Alert,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";

export const StyledTableCell = styled(TableCell)(
  (
    {
      /*theme*/
    }
  ) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#9A82DB",
      color: "#000000",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  })
);

// Passenger component
const Passengers: React.FC = () => {
  const [passengers, setPassengers] = React.useState<any[]>([]);
  const [allPassengers, setAllPassengers] = React.useState<any[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedPassenger, setSelectedPassenger] = React.useState<any>(null);
  const [statusChange, setStatusChange] = React.useState<string | null>(null);
  const [searchCategory, setSearchCategory] = React.useState<string>("firstName");

  React.useEffect(() => {
    getAllPassengers();
  }, []);

  // Function to fetch all passengers
  const getAllPassengers = () => {
    setPassengers([]);
    setAllPassengers([]);
    console.log("Fetching all passengers...");

    fetch("http://localhost:3000/api/v1/passenger")
      .then((res) => res.json())
      .then((data) => {
        setPassengers(data.data);
        setAllPassengers(data.data);
      })
      .catch((error) => {
        console.error("Error fetching passengers:", error);
        setErrorMessage("Error fetching passengers");
      });
  };

  // Function to update passenger status
  const updatePassengerStatus = (id: string, action: string) => {
    axios
      .put(`http://localhost:3000/api/v1/passenger/${id}`, { action })
      .then((response) => {
        console.log(`Passenger ${action}d:`, response);
        getAllPassengers(); // Refresh the passenger list
      })
      .catch((error) => {
        console.error(`Error ${action}ing passenger:`, error);
        setErrorMessage(`Error ${action}ing passenger`);
      });
  };

  // Function to handle search
 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const searchTerm = e.target.value.toLowerCase();

  const filteredPassengers = allPassengers.filter((passenger) => {
    switch (searchCategory) {
      case "firstName":
        return passenger.firstName.toLowerCase().includes(searchTerm);
      case "lastName":
        return passenger.lastName.toLowerCase().includes(searchTerm);
      case "nic":
        return passenger.nicNo.toLowerCase().includes(searchTerm);
      case "email":
        return passenger.email.toLowerCase().includes(searchTerm);
      case "gender":
        return passenger.gender.toLowerCase().includes(searchTerm);
      default:
        return false;
    }
  });

  setPassengers(filteredPassengers);

  if (filteredPassengers.length === 0) {
    setErrorMessage("Cannot find the passenger in this category.");
  } else {
    setErrorMessage("");
  }
};

  // Function to handle dialog open
  const handleDialogOpen = (passenger: any, action: string) => {
    setSelectedPassenger(passenger);
    setStatusChange(action);
    setOpenDialog(true);
  };

  // Function to handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedPassenger(null);
    setStatusChange(null);
  };

  // Function to handle confirm change
  const handleConfirmChange = () => {
    if (selectedPassenger && statusChange) {
      updatePassengerStatus(selectedPassenger._id, statusChange);
    }
    handleDialogClose();
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: "-60px", width: "91vw" }}>
      <br />
      <br />
      <NavigationBar/>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle sx={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
          Passenger Details Management
        </DialogTitle>
        
        <div>
  <FormControl sx={{ minWidth: 150, marginRight: "10px" }}>
    <InputLabel>Search by</InputLabel>
    <Select
      value={searchCategory}
      onChange={(e) => setSearchCategory(e.target.value)}
      label="Search by"
    >
      <MenuItem value="firstName">First Name</MenuItem>
      <MenuItem value="lastName">Last Name</MenuItem>
      <MenuItem value="nic">NIC</MenuItem>
      <MenuItem value="email">Email</MenuItem>
      <MenuItem value="gender">Gender</MenuItem>
    </Select>
  </FormControl>

  

<TextField
            placeholder="Search"
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
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
                <StyledTableCell align="center">First Name</StyledTableCell>
                <StyledTableCell align="center">Last Name</StyledTableCell>
                <StyledTableCell align="center">NIC No</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Gender</StyledTableCell>
                <StyledTableCell align="center">Contact No</StyledTableCell>
                <StyledTableCell align="center">Birthday</StyledTableCell>
                <StyledTableCell align="center">Is Internal</StyledTableCell>
                <StyledTableCell align="center">Company Name</StyledTableCell>
                <StyledTableCell align="center">Service No</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passengers.map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center">{row.firstName}</TableCell>
                  <TableCell align="center">{row.lastName}</TableCell>
                  <TableCell align="center">{row.nicNo}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="center">{row.gender}</TableCell>
                  <TableCell align="center">{row.contactNo}</TableCell>
                  <TableCell align="center">
                    {new Date(row.birthday).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {row.isInternal ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="center">{row.companyName}</TableCell>
                  <TableCell align="center">{row.serviceNo}</TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={row.isActive}
                          onChange={() =>
                            handleDialogOpen(
                              row,
                              row.isActive ? "deactivate" : "activate"
                            )
                          }
                          color="primary"
                        />
                      }
                      label={row.isActive ? "Active" : "Inactive"}
                      labelPlacement="start"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {statusChange === "activate"
            ? "Activate Passenger"
            : "Deactivate Passenger"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {statusChange} this passenger?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmChange} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Passengers;
