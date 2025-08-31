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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  //TextareaAutosize,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NavigationBar from "../components/NavigationBar";
import { StyledTableCell } from "./BeeKeepers"; 

// Define the Product interface based on your schema
interface Product {
  _id: string;
  beekeeper: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string
  };
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

// Define the Products component
const Products: React.FC = () => {
  // State variables
  const [products, setProducts] = React.useState<Product[]>([]);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] = React.useState<string>("productName");
  const [rejectionDialogOpen, setRejectionDialogOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Fetch all products when component mounts
  React.useEffect(() => {
    getAllProducts();
  }, []);

  // Function to fetch all products from the API
  const getAllProducts = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/v1/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.data) {
          setProducts(data.data);
          setAllProducts(data.data);
        } else {
          setErrorMessage("Failed to fetch products");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setErrorMessage("Failed to fetch products. Please try again later.");
        setLoading(false);
      });
  };

  // Function to handle product approval
  const handleApproveProduct = async (productId: string) => {
    try {
      const token = localStorage.getItem("authToken"); // Get authentication token
      const response = await fetch(`http://localhost:3000/api/v1/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include auth token if required
        },
        body: JSON.stringify({ status: "approved" }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Product approved successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        
        // Update the product in local state
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId ? {...product, status: "approved"} : product
          )
        );
        setAllProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId ? {...product, status: "approved"} : product
          )
        );
      } else {
        setErrorMessage(data.msg || "Failed to approve product");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error approving product:", error);
      setErrorMessage("Failed to approve product. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // Function to handle product rejection
  const handleRejectProduct = async () => {
    if (!selectedProduct || !rejectionReason.trim()) return;

    try {
      const token = localStorage.getItem("authToken"); // Get authentication token
      const response = await fetch(`http://localhost:3000/api/v1/products/${selectedProduct._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include auth token if required
        },
        body: JSON.stringify({ 
          status: "rejected",
          rejectionReason: rejectionReason.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Product rejected successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        setRejectionDialogOpen(false);
        setRejectionReason("");
        
        // Update the product in local state
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === selectedProduct._id 
              ? {...product, status: "rejected", rejectionReason: rejectionReason.trim()} 
              : product
          )
        );
        setAllProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === selectedProduct._id 
              ? {...product, status: "rejected", rejectionReason: rejectionReason.trim()} 
              : product
          )
        );
      } else {
        setErrorMessage(data.msg || "Failed to reject product");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error rejecting product:", error);
      setErrorMessage("Failed to reject product. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // Function to open rejection dialog
  const openRejectionDialog = (product: Product) => {
    setSelectedProduct(product);
    setRejectionDialogOpen(true);
  };

  // Function to handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (allProducts.length === 0) {
      setProducts([]);
      setErrorMessage("No products in the database.");
      return;
    }

    const filteredProducts = allProducts.filter((product) => {
      switch (searchCategory) {
        case "productName":
          return product?.productName?.toLowerCase()?.includes(searchTerm) ?? false;
        case "productType":
          return product?.productType?.toLowerCase()?.includes(searchTerm) ?? false;
        case "qualityGrade":
          return product?.qualityGrade?.toLowerCase()?.includes(searchTerm) ?? false;
        case "originLocation":
          return product?.originLocation?.toLowerCase()?.includes(searchTerm) ?? false;
        case "beekeeper":
          return product?.beekeeper?._id?.toLowerCase()?.includes(searchTerm) ?? false;
        case "status":
          return product?.status?.toLowerCase()?.includes(searchTerm) ?? false;
        default:
          return false;
      }
    });

    setProducts(filteredProducts);
    if (filteredProducts.length === 0) {
      setErrorMessage("Cannot find the product in this category.");
    } else {
      setErrorMessage("");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
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
          Product Inventory
        </DialogTitle>

        <div>
          <FormControl sx={{ minWidth: 150, marginRight: "10px" }}>
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
        <Alert severity="error" sx={{ marginTop: "10px" }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ marginTop: "10px" }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}
      <br />

      <div style={{ height: "400px", overflow: "auto" }}>
        {/* Table to display products */}
        <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
          <Table aria-label="products table" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Product Name</StyledTableCell>
                <StyledTableCell align="center">Type</StyledTableCell>
                <StyledTableCell align="center">Quantity</StyledTableCell>
                <StyledTableCell align="center">Unit</StyledTableCell>
                <StyledTableCell align="center">Price</StyledTableCell>
                <StyledTableCell align="center">Harvest Date</StyledTableCell>
                <StyledTableCell align="center">Quality Grade</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Beekeeper</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography>Loading products...</Typography>
                  </TableCell>
                </TableRow>
              ) : Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell align="center" component="th" scope="row">
                      {product.productName}
                    </TableCell>
                    <TableCell align="center">{product.productType}</TableCell>
                    <TableCell align="center">{product.quantity}</TableCell>
                    <TableCell align="center">{product.unit}</TableCell>
                    <TableCell align="center">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="center">{formatDate(product.harvestDate)}</TableCell>
                    <TableCell align="center">{product.qualityGrade}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={product.status} 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        color={getStatusColor(product.status) as any} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      {product.beekeeper ? `${product.beekeeper.firstName} ${product.beekeeper.lastName}` : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {product.status === "pending" && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Button 
                            variant="contained" 
                            color="success" 
                            size="small"
                            onClick={() => handleApproveProduct(product._id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="error" 
                            size="small"
                            onClick={() => openRejectionDialog(product)}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      {product.status === "rejected" && product.rejectionReason && (
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          onClick={() => alert(`Rejection Reason: ${product.rejectionReason}`)}
                        >
                          View Reason
                        </Button>
                      )}
                      {product.status === "approved" && (
                        <Chip 
                          label="Approved" 
                          color="success" 
                          size="small"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No products available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Rejection Reason Dialog */}
      <Dialog
        open={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        aria-labelledby="rejection-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="rejection-dialog-title">
          Reject Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting{" "}
            {selectedProduct ? <strong>{selectedProduct.productName}</strong> : "this product"}.
            The beekeeper will be notified.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRejectProduct} 
            color="error"
            disabled={!rejectionReason.trim()}
            variant="contained"
          >
            Reject Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products;