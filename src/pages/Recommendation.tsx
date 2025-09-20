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
  //Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Tooltip,
  alpha,
  useTheme,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Styled TableCell
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

// Styled TableRow
const StyledTableRow = styled(TableRow)(({ theme }) => ({
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

export interface Recommendation {
  _id?: string;
  beekeeperId: { no: string; email: string };
  hiveId: { hiveId: string; hiveName: string };

  recommendations: string;

  date: string;
}

const Recommendations: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const [recommendations, setRecommendations] = React.useState<
    Recommendation[]
  >([]);
  const [allRecommendations, setAllRecommendations] = React.useState<
    Recommendation[]
  >([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] =
    React.useState<string>("category");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [exportFormat, setExportFormat] = React.useState<string>("");

  React.useEffect(() => {
    getAllRecommendations();
  }, []);

  const getAllRecommendations = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:3000/api/v1/recommendation")
      .then((res) => {
        setRecommendations(res.data.data);
        setAllRecommendations(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage("Error fetching recommendations");
        setIsLoading(false);
      });
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Recommendations Report", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["ID", "Beekeeper", "Hive", "Message"]],
      body: recommendations.map((r) => [
        r.hiveId?.hiveId || "",
        r.beekeeperId?.no || "",
        r.hiveId?.hiveName || "",

        r.recommendations,
      ]),
    });
    doc.save("recommendations-report.pdf");
  };

  // Export CSV
  const exportCSV = () => {
    const header = ["ID", "Beekeeper", "Hive", "Message"];
    const rows = recommendations.map((r) => [
      r.hiveId?.hiveId,
      r.beekeeperId?.no,
      r.hiveId?.hiveName,

      r.recommendations,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "recommendations-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle export change
  const handleExportFormatChange = (format: string) => {
    setExportFormat(format);
    if (format === "pdf") exportPDF();
    else if (format === "csv") exportCSV();
    setTimeout(() => setExportFormat(""), 500);
  };

  // Search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = allRecommendations.filter((r) => {
      switch (searchCategory) {
        case "beekeeper":
          return r.beekeeperId?.no?.toLowerCase().includes(term);
        case "hive":
          return r.hiveId?.hiveName?.toLowerCase().includes(term);
        default:
          return false;
      }
    });
    setRecommendations(filtered);
  };

  // Delete
  const handleDeleteConfirmation = () => {
    setIsConfirmationDialogOpen(false);
    if (selected.length > 0) {
      axios
        .delete(`http://localhost:3000/api/v1/recommendation/${selected[0]}`)
        .then(() => {
          setSelected([]);
          getAllRecommendations();
        })
        .catch(() => {
          setErrorMessage("Error deleting recommendation");
        });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <NavigationBar />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Recommendations Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage hive recommendations, update their status, and export reports.
        </Typography>
      </Box>

      {/* Stats */}
      <Card sx={{ mb: 3, bgcolor: alpha("#FFB700", 0.05) }}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Recommendations Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {recommendations.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Search + Actions */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Search by</InputLabel>
              <Select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                label="Search by"
                size="small"
              >
               
                <MenuItem value="beekeeper">Beekeeper</MenuItem>
                <MenuItem value="hive">Hive</MenuItem>
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

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : recommendations.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <VisibilityIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No recommendations found
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: "calc(100vh - 340px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Beekeeper</StyledTableCell>
                    <StyledTableCell>Hive</StyledTableCell>
                    <StyledTableCell>Recommendation</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recommendations.map((row) => (
                    <StyledTableRow key={row._id}>
                      <TableCell>
                        {row.date
                          ? new Date(row.date).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell>{row.beekeeperId?.no}</TableCell>
                      <TableCell>{row.hiveId?.hiveName}</TableCell>

                      <TableCell>{row.recommendations}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => {
                              setSelected([row._id || ""]);
                              setIsConfirmationDialogOpen(true);
                            }}
                            color="error"
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

      {/* Delete confirmation */}
      <Dialog
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this recommendation?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmationDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmation}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recommendations;
