import * as React from "react";
import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,

  styled,
  tableCellClasses,
  TextField,
  InputAdornment,
  
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Tooltip,
  alpha,
  useTheme,
  Stack,
 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import VisibilityIcon from "@mui/icons-material/Visibility";
import NavigationBar from "../components/NavigationBar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: alpha("#FFB700", 0.05),
  },
  cursor: "pointer",
  transition: "background-color 0.2s ease",
}));

// Define the Hive interface
interface Hive {
  _id: string;
  id: string;
  beekeeper: string;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const [hives, setHives] = React.useState<Hive[]>([]);
  const [allHives, setAllHives] = React.useState<Hive[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] = React.useState<string>("id");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [exportFormat, setExportFormat] = React.useState<string>("");
  const [selected, setSelected] = React.useState<string[]>([]);

  // Fetch all hives when component mounts
  React.useEffect(() => {
    getAllHives();
  }, []);

  // Function to fetch all hives from the API
  const getAllHives = () => {
    setIsLoading(true);
    fetch("http://localhost:3000/api/v1/hive")
      .then((res) => res.json())
      .then((data) => {
        setHives(data.data);
        setAllHives(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hives:", error);
        setErrorMessage("Error fetching hives");
        setIsLoading(false);
      });
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Hives Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Hive ID",
          "Beekeeper",
          "Hive Name",
          "Type",
          "Location",
          "Est. Year",
          "Strength",
          "Population",
          "Queen Status",
          "Brood Pattern",
          "Honey Stores",
          "Pest Level",
          "Status",
        ],
      ],
      body: hives.map((h) => [
        h.id ?? "",
        h.beekeeper ?? "",
        h.hiveName ?? "",
        h.hiveType ?? "",
        h.location ?? "",
        new Date(h.establishedYear).getFullYear(),
        h.strength ?? "",
        h.population ?? "",
        h.queenStatus ?? "",
        h.broodPattern ?? "",
        h.honeyStores ?? "",
        h.pestLevel ?? "",
        h.status ?? "",
      ]),
    });

    doc.save("hives-report.pdf");
  };

  // Export CSV
  const exportCSV = () => {
    const header = [
      "Hive ID",
      "Beekeeper",
      "Hive Name",
      "Type",
      "Location",
      "Est. Year",
      "Strength",
      "Population",
      "Queen Status",
      "Brood Pattern",
      "Honey Stores",
      "Pest Level",
      "Status",
    ];
    const rows = hives.map((h) => [
      h.id,
      h.beekeeper,
      h.hiveName,
      h.hiveType,
      h.location,
      new Date(h.establishedYear).getFullYear(),
      h.strength,
      h.population,
      h.queenStatus,
      h.broodPattern,
      h.honeyStores,
      h.pestLevel,
      h.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hives-report.csv");
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
  const handleClick = (_event: React.MouseEvent<unknown>, id: string) => {
    const newSelected: string[] = [id];
    setSelected(newSelected);
    setErrorMessage("");
  };
  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Function to handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (allHives.length === 0) {
      setHives([]);
      setErrorMessage("No hives in the database.");
      return;
    }

    const filteredHives = allHives.filter((hive) => {
      switch (searchCategory) {
        case "id":
          return hive?.id?.toLowerCase()?.includes(term) ?? false;
        case "no":
          return hive?.beekeeper?.toLowerCase()?.includes(term) ?? false;
        case "type":
          return hive?.hiveType?.toLowerCase()?.includes(term) ?? false;
        case "location":
          return hive?.location?.toLowerCase()?.includes(term) ?? false;
        case "queenBreed":
          return hive?.queenStatus?.toLowerCase()?.includes(term) ?? false;
        case "population":
          return hive?.population?.toString()?.includes(term) ?? false;
        case "hiveName":
          return hive.hiveName.toLowerCase().includes(term) ?? false;
        case "queenStatus":
          return hive.queenStatus.toLowerCase().includes(term) ?? false;
        case "broodPattern":
          return hive.broodPattern.toLowerCase().includes(term) ?? false;
        case "status":
          return hive.status.toLowerCase().includes(term) ?? false;
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

  const updateHiveStatus = async (hiveId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/hive/${hiveId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

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

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      case "Maintenance":
        return "warning";
      case "Quarantined":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <NavigationBar />

      {/* Fixed Header Section */}
      <Box
        sx={{
          mb: 4,
          position: "sticky",
          top: 0,
          backgroundColor: "background.paper",
          zIndex: 100,
          pt: 2,
          pb: 2,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="700" gutterBottom>
          Hive Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all hives in your system, view their details, and update their
          status.
        </Typography>
      </Box>

      {/* Stats Card */}
      <Card
        sx={{
          mb: 3,
          bgcolor: alpha("#FFB700", 0.05),
          position: "sticky",
          top: 160,
          zIndex: 90,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Hives Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {hives.length} hives
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`${hives.filter((h) => h.status === "Active").length} Active`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`${hives.filter((h) => h.status === "Maintenance").length} Maintenance`}
              color="warning"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Search and Actions Section - Fixed */}
      <Card sx={{ mb: 2, position: "sticky", top: 230, zIndex: 80 }}>
        <CardContent>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Search by</InputLabel>
              <Select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                label="Search by"
              >
                <MenuItem value="id">Hive ID</MenuItem>
                <MenuItem value="no">Beekeeper</MenuItem>
                <MenuItem value="hiveName">Hive Name</MenuItem>
                <MenuItem value="hiveType">Type</MenuItem>
                <MenuItem value="location">Location</MenuItem>
                <MenuItem value="queenBreed">Queen Breed</MenuItem>
                <MenuItem value="broodPattern">Brood Pattern</MenuItem>
                <MenuItem value="population">Population</MenuItem>
              </Select>
            </FormControl>

            <TextField
              placeholder="Search hives..."
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
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setErrorMessage("")}
        >
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccessMessage("")}
        >
          {successMessage}
        </Alert>
      )}

      {/* Table Section - Scrollable */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : hives.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                textAlign: "center",
              }}
            >
              <VisibilityIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hives found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm
                  ? "Try adjusting your search query"
                  : "Add a new hive to get started"}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: "calc(100vh - 340px)" }}>
              <Table
                stickyHeader
                aria-label="hives table"
                sx={{ minWidth: 1200 }}
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Hive ID</StyledTableCell>
                    <StyledTableCell>Beekeeper</StyledTableCell>
                    <StyledTableCell>Hive Name</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell>Est. Year</StyledTableCell>
                    <StyledTableCell align="center">Strength</StyledTableCell>
                    <StyledTableCell align="center">Population</StyledTableCell>
                    <StyledTableCell>Queen Status</StyledTableCell>
                    <StyledTableCell>Brood Pattern</StyledTableCell>
                    <StyledTableCell align="center">
                      Honey Stores
                    </StyledTableCell>
                    <StyledTableCell align="center">Pest Level</StyledTableCell>
                    <StyledTableCell align="center">
                      Disease Signs
                    </StyledTableCell>

                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hives.map((row) => {
                    const isItemSelected = isSelected(row._id || "");
                    return (
                      <StyledTableRow
                        key={row._id}
                        hover
                        onClick={(event) => handleClick(event, row._id || "")}
                        selected={isItemSelected}
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: alpha("#FFB700", 0.08),
                            "&:hover": {
                              backgroundColor: alpha("#FFB700", 0.12),
                            },
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {row.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.beekeeper}</TableCell>
                        <TableCell>{row.hiveName}</TableCell>
                        <TableCell>{row.hiveType}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>{formatYear(row.establishedYear)}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${row.strength}/10`}
                            size="small"
                            color={
                              row.strength > 7
                                ? "success"
                                : row.strength > 4
                                  ? "warning"
                                  : "error"
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">{row.population}</TableCell>
                        <TableCell>{row.queenStatus}</TableCell>
                        <TableCell>{row.broodPattern}</TableCell>
                        <TableCell align="center">{row.honeyStores}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${row.pestLevel}/10`}
                            size="small"
                            color={
                              row.pestLevel > 7
                                ? "error"
                                : row.pestLevel > 4
                                  ? "warning"
                                  : "success"
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {row.diseaseSigns.length > 0 ? (
                            <Tooltip title={row.diseaseSigns.join(", ")}>
                              <Chip
                                label={`${row.diseaseSigns.length} signs`}
                                size="small"
                                color="error"
                                variant="outlined"
                              />
                            </Tooltip>
                          ) : (
                            <Chip
                              label="None"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Select
                            value={row.status || "Active"}
                            onChange={(e) =>
                              updateHiveStatus(row.id, e.target.value)
                            }
                            size="small"
                            sx={{ minWidth: 120 }}
                          >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                            <MenuItem value="Maintenance">Maintenance</MenuItem>
                            <MenuItem value="Quarantined">Quarantined</MenuItem>
                          </Select>
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
    </Container>
  );
};

export default Hives;
