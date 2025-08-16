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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NavigationBar from "../components/NavigationBar";
import { StyledTableCell } from "./BeeKeepers";

// Define the Hive interface
interface Hive {
  id: string;
  no: string;
  type: string;
  chassisNo: string;
  productionYear: string;
  ac: boolean;
  fuelType: string;
  availability: boolean;
}

// Define the Hives component
const Hives: React.FC = () => {
  // State variables
  const [hives, setHives] = React.useState<Hive[]>([]);
  const [allHives, setAllHives] = React.useState<Hive[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] = React.useState<string>("id");

  // Fetch all hives when component mounts
  React.useEffect(() => {
    getAllHives();
  }, []);

  // Function to fetch all hives
  const getAllHives = () => {
    fetch("http://localhost:3000/api/v1/hive")
      .then((res) => res.json())
      .then((data) => {
        setHives(data.data);
        setAllHives(data.data);
      })
      .catch(() => {
        setErrorMessage("Failed to fetch hives.");
      });
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
          return hive?.id?.toLowerCase().includes(searchTerm);
        case "no":
          return hive?.no?.toLowerCase().includes(searchTerm);
        case "type":
          return hive?.type?.toLowerCase().includes(searchTerm);
        case "chassisNo":
          return hive?.chassisNo?.toLowerCase().includes(searchTerm);
        case "brand":
          return hive?.brand?.toLowerCase().includes(searchTerm);
        case "fuelType":
          return hive?.fuelType?.toLowerCase().includes(searchTerm);
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
              <MenuItem value="type">Location</MenuItem>
              <MenuItem value="chassisNo">Population</MenuItem>
              <MenuItem value="brand">Status</MenuItem>
              <MenuItem value="fuelType">Products</MenuItem>
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
        {/* Table to display hives */}
        <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Hive ID</StyledTableCell>
                <StyledTableCell align="right">Owner ID</StyledTableCell>
                <StyledTableCell align="right">Location</StyledTableCell>
                <StyledTableCell align="right">Population</StyledTableCell>
                <StyledTableCell align="right">Established Year</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right">Products</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {hives.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center" component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.no}</TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{row.chassisNo}</TableCell>
                  <TableCell align="right">
                    {new Date(row.productionYear).getFullYear()}
                  </TableCell>
                  <TableCell align="right">
                    {row.ac ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell align="right">{row.fuelType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
};

export default Hives;