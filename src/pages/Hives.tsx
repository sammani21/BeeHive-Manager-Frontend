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
  InputAdornment,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  DialogTitle,
  Chip,
  //Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NavigationBar from "../components/NavigationBar";
import { StyledTableCell } from "./BeeKeepers";

// Define the Hive interface
interface Hive {
  id: string;
  no: string;
  hiveName: string;
  hiveType: string;
  location: string;
  establishedYear: string;
  strength: number;
   status: string; 
  queenStatus: string;
  products: string;
  population: number;
  availability: boolean;
  broodPattern: string;
  honeyStores: number;
  pestLevel: number;
  diseaseSigns: string[];
}

// Define the Hives component
const Hives: React.FC = () => {
  // State variables
  const [hives, setHives] = React.useState<Hive[]>([]);
  const [allHives, setAllHives] = React.useState<Hive[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] = React.useState<string>("id");
  const [successMessage, setSuccessMessage] = React.useState<string>("");

  // Fetch all hives when component mounts
  React.useEffect(() => {
    getAllHives();
  }, []);

  // Function to fetch all hives from the API
  const getAllHives = () => {
    fetch("http://localhost:3000/api/v1/hive")
      .then((res) => res.json())
      .then((data) => {
        setHives(data.data);
        setAllHives(data.data);
      });
  };

   const updateHiveStatus = async (hiveId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/hive/${hiveId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage("Hive status updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        // Refresh the hive list
        getAllHives();
      } else {
        setErrorMessage(data.msg || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setErrorMessage("Failed to update status");
    }
  };

  // Function to handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (allHives.length === 0) {
      setHives([]);
      setErrorMessage("No hives in the database.");
      return;
    }

    const filteredHives = allHives.filter((hive) => {
      switch (searchCategory) {
        case "id":
          return hive?.id?.toLowerCase()?.includes(searchTerm) ?? false;
        case "no":
          return hive?.no?.toLowerCase()?.includes(searchTerm) ?? false;
        case "type":
          return hive?.hiveType?.toLowerCase()?.includes(searchTerm) ?? false;
        case "location":
          return hive?.location?.toLowerCase()?.includes(searchTerm) ?? false;
        case "queenBreed":
          return (
            hive?.queenStatus?.toLowerCase()?.includes(searchTerm) ?? false
          );

        case "population":
          return hive?.population?.toString()?.includes(searchTerm) ?? false;
        case "hiveName":
          return hive.hiveName.toLowerCase().includes(searchTerm) ?? false;
        case "queenStatus":
          return hive.queenStatus.toLowerCase().includes(searchTerm) ?? false;
        case "broodPattern":
          return hive.broodPattern.toLowerCase().includes(searchTerm) ?? false;
          case "status":
          return hive.status.toLowerCase().includes(searchTerm) ?? false;
        default:
          return false;
      }
    });

    setHives(filteredHives);
    if (filteredHives.length === 0) {
      setErrorMessage("Cannot find the hive in this category.");
    } else {
      setErrorMessage("");
    }
  };
  
  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
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
          Hive Details Management
        </DialogTitle>

        <div>
          <FormControl sx={{ minWidth: 150, marginRight: "10px" }}>
            <InputLabel>Search by</InputLabel>
            <Select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              label="Search by"
            >
              <MenuItem value="id">Hive ID</MenuItem>
              <MenuItem value="no">Owner ID</MenuItem>
              <MenuItem value="hiveName">Hive Name</MenuItem>
              <MenuItem value="hiveType">Type</MenuItem>
              <MenuItem value="location">Location</MenuItem>
              <MenuItem value="queenBreed">Queen Breed</MenuItem>
              <MenuItem value="broodPattern">Brood Pattern</MenuItem>
              <MenuItem value="population">Population</MenuItem>
              <MenuItem value="status">Status</MenuItem>
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
      {successMessage && (
        <Alert severity="success" sx={{ marginTop: "10px" }}>
          {successMessage}
        </Alert>
      )}
      <br />

      <div style={{ height: "400px", overflow: "auto" }}>
        {/* Table to display hives */}
        <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Hive ID</StyledTableCell>
                <StyledTableCell align="right">Owner ID</StyledTableCell>
                <StyledTableCell align="center">Type</StyledTableCell>
                <StyledTableCell align="right">Hive Name</StyledTableCell>
                <StyledTableCell align="right">Honey Stores</StyledTableCell>
                <StyledTableCell align="right">Location</StyledTableCell>
                <StyledTableCell align="right">Population</StyledTableCell>
                <StyledTableCell align="right">
                  Established Year
                </StyledTableCell>
                <StyledTableCell align="right">Strength</StyledTableCell>
                <StyledTableCell align="right">Brood Pattern</StyledTableCell>
                <StyledTableCell align="right">Queen Status</StyledTableCell>

                <StyledTableCell align="right">Pest Level</StyledTableCell>
                <StyledTableCell align="right">Disease Signs</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.isArray(hives) && hives.length > 0 ? (
                hives.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center" component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.no}</TableCell>
                    <TableCell align="right">{row.hiveType}</TableCell>
                    <TableCell align="right">{row.hiveName}</TableCell>
                    <TableCell align="right">{row.honeyStores}</TableCell>
                    <TableCell align="right">{row.location}</TableCell>
                    <TableCell align="right">{row.population}</TableCell>
                    <TableCell align="right">
                      {formatYear(row.establishedYear)}
                    </TableCell>
                    <TableCell align="right">{row.strength}/10</TableCell>
                    <TableCell align="right">{row.broodPattern}</TableCell>
                    <TableCell align="right">{row.queenStatus}</TableCell>
                    <TableCell align="right">{row.pestLevel}/10</TableCell>
                    <TableCell align="right">
                      {row.diseaseSigns.length > 0
                        ? row.diseaseSigns.map((disease, index) => (
                            <Chip
                              key={index}
                              label={disease}
                              size="small"
                              sx={{ margin: "2px" }}
                            />
                          ))
                        : "None"}
                    </TableCell>
                    <TableCell align="right">
                      <Select
                        value={row.status || "Active"}
                        onChange={(e) => updateHiveStatus(row.id, e.target.value)}
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Maintenance">Maintenance</MenuItem>
                        <MenuItem value="Quarantined">Quarantined</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No hives available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
};

export default Hives;
