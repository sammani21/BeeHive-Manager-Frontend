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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  styled,
  tableCellClasses,
  Alert,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#FFD700",
    color: "#000000",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Products component
const Products: React.FC = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [allProducts, setAllProducts] = React.useState<any[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [statusChange, setStatusChange] = React.useState<string | null>(null);
  const [searchCategory, setSearchCategory] = React.useState<string>("productId");

  React.useEffect(() => {
    getAllProducts();
  }, []);

  // Function to fetch all products
  const getAllProducts = () => {
    setProducts([]);
    setAllProducts([]);
    console.log("Fetching all Products...");

    fetch("http://localhost:3000/api/v1/product")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
        setAllProducts(data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setErrorMessage("Error fetching products");
      });
  };

  // Function to update product status
  const updateProductStatus = (id: string, action: string) => {
    axios
      .put(`http://localhost:3000/api/v1/product/${id}`, { action })
      .then((response) => {
        console.log(`Product ${action}d:`, response);
        getAllProducts(); // Refresh the product list
      })
      .catch((error) => {
        console.error(`Error ${action}ing product:`, error);
        setErrorMessage(`Error ${action}ing product`);
      });
  };

  // Function to handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    const filteredProducts = allProducts.filter((product) => {
      switch (searchCategory) {
        case "productId":
          return product.productId.toLowerCase().includes(searchTerm);
        case "type":
          return product.type.toLowerCase().includes(searchTerm);
        default:
          return false;
      }
    });

    setProducts(filteredProducts);

    if (filteredProducts.length === 0) {
      setErrorMessage("Cannot find the products in this category.");
    } else {
      setErrorMessage("");
    }
  };

  // Function to handle dialog open
  const handleDialogOpen = (product: any, action: string) => {
    setSelectedProduct(product);
    setStatusChange(action);
    setOpenDialog(true);
  };

  // Function to handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setStatusChange(null);
  };

  // Function to handle confirm change
  const handleConfirmChange = () => {
    if (selectedProduct && statusChange) {
      updateProductStatus(selectedProduct._id, statusChange);
    }
    handleDialogClose();
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
          Products Details Management
        </DialogTitle>

        <div>
          <FormControl sx={{ minWidth: 150, marginRight: "10px" }}>
            <InputLabel>Search by</InputLabel>
            <Select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              label="Search by"
            >
              <MenuItem value="productId">Product ID</MenuItem>
              <MenuItem value="type">Product Type</MenuItem>
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
                <StyledTableCell align="center">Product ID</StyledTableCell>
                <StyledTableCell align="center">Hive ID</StyledTableCell>
                <StyledTableCell align="center">Type</StyledTableCell>
                <StyledTableCell align="center">Quantity</StyledTableCell>
                <StyledTableCell align="center">Quality</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center">{row.productId}</TableCell>
                  <TableCell align="center">{row.hiveId}</TableCell>
                  <TableCell align="center">{row.type}</TableCell>
                  <TableCell align="center">{row.quantity}</TableCell>
                  <TableCell align="center">{row.quality}</TableCell>
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
          {statusChange === "activate" ? "Activate Product" : "Deactivate Product"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {statusChange} this product?
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

export default Products;