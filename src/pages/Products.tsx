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
  //Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NavigationBar from "../components/NavigationBar";
import { StyledTableCell } from "./BeeKeepers";

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
  const [products, setProducts] = React.useState<Product[]>([]);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [searchCategory, setSearchCategory] = React.useState<string>("productName");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = () => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setErrorMessage("Failed to fetch products. Please try again later.");
        setLoading(false);
      });
  };

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
          return product?.beekeeper?.toLowerCase()?.includes(searchTerm) ?? false;
        default:
          return false;
      }
    });

    setProducts(filteredProducts);
    setErrorMessage(filteredProducts.length === 0 ? "Cannot find the product in this category." : "");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: "-60px", width: "91vw" }}>
      <br />
      <br />
      <NavigationBar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                <StyledTableCell align="center">Beekeeper</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography>Loading products...</Typography>
                  </TableCell>
                </TableRow>
              ) : Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell align="center">{product.productName}</TableCell>
                    <TableCell align="center">{product.productType}</TableCell>
                    <TableCell align="center">{product.quantity}</TableCell>
                    <TableCell align="center">{product.unit}</TableCell>
                    <TableCell align="center">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="center">{formatDate(product.harvestDate)}</TableCell>
                    <TableCell align="center">{product.qualityGrade}</TableCell>
                    <TableCell align="center">{product.beekeeper || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No products available.
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

export default Products;
