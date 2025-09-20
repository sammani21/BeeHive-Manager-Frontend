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
  //Tooltip,
  alpha,
  useTheme,
  Stack,
  //IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
//import DownloadIcon from "@mui/icons-material/Download";
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

// Define the Product interface based on your schema
interface Product {
  _id: string;
  beekeeper: string;
  productName: string;
  productType: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  harvestDate: string;
  expiryDate: string;
  qualityGrade: string;
  originLocation: string;
  moistureContent: number;
  waxColor: string;
  pollenSource: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const Products: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] =
    React.useState<string>("productName");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [exportFormat, setExportFormat] = React.useState<string>("");
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = () => {
    setIsLoading(true);
    fetch("http://localhost:3000/api/v1/products")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.data) {
          setProducts(data.data);
          setAllProducts(data.data);
        } else {
          setErrorMessage("Failed to fetch products");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setErrorMessage("Failed to fetch products. Please try again later.");
        setIsLoading(false);
      });
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Products Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Product Name",
          "Type",
          "Quantity",
          "Unit",
          "Price",
          "Quality Grade",
          "Harvest Date",
          "Origin",
          "Status",
        ],
      ],
      body: products.map((p) => [
        p.productName ?? "",
        p.productType ?? "",
        p.quantity ?? "",
        p.unit ?? "",
        `$${p.price.toFixed(2)}`,
        p.qualityGrade ?? "",
        formatDate(p.harvestDate),
        p.originLocation ?? "",
        p.status ?? "",
      ]),
    });

    doc.save("products-report.pdf");
  };

  // Export CSV
  const exportCSV = () => {
    const header = [
      "Product Name",
      "Type",
      "Quantity",
      "Unit",
      "Price",
      "Quality Grade",
      "Harvest Date",
      "Origin",
      "Status",
    ];
    const rows = products.map((p) => [
      p.productName,
      p.productType,
      p.quantity,
      p.unit,
      `$${p.price.toFixed(2)}`,
      p.qualityGrade,
      formatDate(p.harvestDate),
      p.originLocation,
      p.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products-report.csv");
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (allProducts.length === 0) {
      setProducts([]);
      setErrorMessage("No products in the database.");
      return;
    }

    const filteredProducts = allProducts.filter((product) => {
      switch (searchCategory) {
        case "productName":
          return product?.productName?.toLowerCase()?.includes(term) ?? false;
        case "productType":
          return product?.productType?.toLowerCase()?.includes(term) ?? false;
        case "qualityGrade":
          return product?.qualityGrade?.toLowerCase()?.includes(term) ?? false;
        case "originLocation":
          return (
            product?.originLocation?.toLowerCase()?.includes(term) ?? false
          );
        case "beekeeper":
          return product?.beekeeper?.toLowerCase()?.includes(term) ?? false;
        default:
          return false;
      }
    });

    setProducts(filteredProducts);
    setErrorMessage(
      filteredProducts.length === 0
        ? "Cannot find the product in this category."
        : ""
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
          Product Inventory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all products in your system, view their details, and track
          inventory.
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
              Products Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {products.length} products
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`${products.filter((p) => p.status === "approved").length} Approved`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`${products.filter((p) => p.status === "pending").length} Pending`}
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
                <MenuItem value="productName">Product Name</MenuItem>
                <MenuItem value="productType">Product Type</MenuItem>
                <MenuItem value="qualityGrade">Quality Grade</MenuItem>
                <MenuItem value="originLocation">Origin Location</MenuItem>
                <MenuItem value="beekeeper">Beekeeper ID</MenuItem>
              </Select>
            </FormControl>

            <TextField
              placeholder="Search products..."
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
          ) : products.length === 0 ? (
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
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm
                  ? "Try adjusting your search query"
                  : "No products available in the system"}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: "calc(100vh - 340px)" }}>
              <Table stickyHeader aria-label="products table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Product Name</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell align="center">Quantity</StyledTableCell>
                    <StyledTableCell align="center">Unit</StyledTableCell>
                    <StyledTableCell align="center">Price</StyledTableCell>
                    <StyledTableCell align="center">
                      Harvest Date
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Quality Grade
                    </StyledTableCell>
                    <StyledTableCell>Origin</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Beekeeper</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => {
                    const isItemSelected = isSelected(product._id || "");
                    return (
                      <StyledTableRow
                        key={product._id}
                        hover
                        onClick={(event) =>
                          handleClick(event, product._id || "")
                        }
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
                            {product.productName}
                          </Typography>
                        </TableCell>
                        <TableCell>{product.productType}</TableCell>
                        <TableCell align="center">{product.quantity}</TableCell>
                        <TableCell align="center">{product.unit}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`$${product.price.toFixed(2)}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(product.harvestDate)}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={product.qualityGrade}
                            size="small"
                            color={
                              product.qualityGrade === "Premium"
                                ? "success"
                                : product.qualityGrade === "Standard"
                                  ? "warning"
                                  : "default"
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{product.originLocation}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getStatusText(product.status)}
                            size="small"
                            color={getStatusColor(product.status)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {product.beekeeper || "N/A"}
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

export default Products;
