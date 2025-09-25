import * as React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  alpha,
  useTheme,
  
  CircularProgress,
  Alert,
 
  Divider,
  
} from "@mui/material";
import {
  Hive as HiveIcon,
  
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  BugReport as BugReportIcon,
  
  People as PeopleIcon,
  Person as PersonIcon,
  EventAvailable as EventAvailableIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
 
} from "@mui/icons-material";
import NavigationBar from "../components/NavigationBar";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

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

// Define the Beekeeper interface
interface Beekeeper {
  _id: string;
  no: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  availability: boolean;
  date: string;
  dob: string;
  nic: string;
  gender: string;
  contactNo: string;
  email: string;
}

// Define the Product interface
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

// Status colors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statusColors = {
  Active: "#4caf50",
  Inactive: "#f44336",
  Maintenance: "#ff9800",
  Quarantined: "#9c27b0",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productStatusColors = {
  approved: "#4caf50",
  pending: "#ff9800",
  rejected: "#f44336",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const [hives, setHives] = React.useState<Hive[]>([]);
  const [beekeepers, setBeekeepers] = React.useState<Beekeeper[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  // Fetch all hives, beekeepers and products when component mounts
  React.useEffect(() => {
    getAllData();
  }, []);

  // Function to fetch all data from the APIs
  const getAllData = () => {
    setIsLoading(true);

    // Use Promise.all to fetch hives, beekeepers and products simultaneously
    Promise.all([
      fetch("http://localhost:3000/api/v1/hive").then((res) => res.json()),
      fetch("http://localhost:3000/api/v1/beekeeper").then((res) => res.json()),
      fetch("http://localhost:3000/api/v1/products").then((res) => res.json()),
    ])
      .then(([hiveData, beekeeperData, productData]) => {
        setHives(hiveData.data);
        setBeekeepers(beekeeperData.data);
        setProducts(productData.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setErrorMessage("Error fetching data");
        setIsLoading(false);
      });
  };

  // Calculate hive statistics
  const totalHives = hives.length;
  const activeHives = hives.filter((h) => h.status === "Active").length;
  const maintenanceHives = hives.filter(
    (h) => h.status === "Maintenance"
  ).length;
  const quarantinedHives = hives.filter(
    (h) => h.status === "Quarantined"
  ).length;
  const averageStrength =
    totalHives > 0
      ? (
          hives.reduce((sum, hive) => sum + hive.strength, 0) / totalHives
        ).toFixed(1)
      : 0;
  const averagePestLevel =
    totalHives > 0
      ? (
          hives.reduce((sum, hive) => sum + hive.pestLevel, 0) / totalHives
        ).toFixed(1)
      : 0;
  const hivesWithDisease = hives.filter(
    (h) => h.diseaseSigns.length > 0
  ).length;

  // Calculate beekeeper statistics
  const totalBeekeepers = beekeepers.length;
  const activeBeekeepers = beekeepers.filter((b) => b.isActive).length;
  const availableBeekeepers = beekeepers.filter((b) => b.availability).length;

  // Calculate product statistics
  const totalProducts = products.length;
  const approvedProducts = products.filter(
    (p) => p.status === "approved"
  ).length;
  const pendingProducts = products.filter((p) => p.status === "pending").length;
  const rejectedProducts = products.filter(
    (p) => p.status === "rejected"
  ).length;
  const totalInventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  //const premiumProducts = products.filter(p => p.qualityGrade === "Premium").length;
  const honeyProducts = products.filter(
    (p) => p.productType === "Honey"
  ).length;
  const waxProducts = products.filter(
    (p) => p.productType === "Beeswax"
  ).length;

  // Prepare data for charts
  const statusData = [
    { name: "Active", value: activeHives },
    { name: "Maintenance", value: maintenanceHives },
    { name: "Quarantined", value: quarantinedHives },
    {
      name: "Inactive",
      value: hives.filter((h) => h.status === "Inactive").length,
    },
  ];

  const productStatusData = [
    { name: "Approved", value: approvedProducts },
    { name: "Pending", value: pendingProducts },
    { name: "Rejected", value: rejectedProducts },
  ];

  const productTypeData = [
    { name: "Honey", value: honeyProducts },
    { name: "Beeswax", value: waxProducts },
    { name: "Other", value: totalProducts - honeyProducts - waxProducts },
  ];

  const beekeeperStatusData = [
    { name: "Active", value: activeBeekeepers },
    { name: "Inactive", value: totalBeekeepers - activeBeekeepers },
  ];

  const availabilityData = [
    { name: "Available", value: availableBeekeepers },
    { name: "Unavailable", value: totalBeekeepers - availableBeekeepers },
  ];

  const strengthData = hives
    .filter((h) => h.strength)
    .sort((a, b) => a.strength - b.strength)
    .slice(0, 10)
    .map((hive) => ({
      name: hive.hiveName,
      strength: hive.strength,
      pest: hive.pestLevel,
    }));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const productValueData = products
    .sort((a, b) => b.price * b.quantity - a.price * a.quantity)
    .slice(0, 5)
    .map((product) => ({
      name: product.productName,
      value: (product.price * product.quantity).toFixed(2),
    }));

  

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <NavigationBar />

      {/* Header Section */}

      {/* Title + Subtitle */}
      <Box sx={{ maxWidth: "100%" }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          🐝 Beekeeping Dashboard
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome to the central hub of your beekeeping operations. Here you can
          monitor hive health, manage beekeepers, track recommendations, and
          analyze production trends — all in one place. Use the live insights
          and visual charts to make better decisions for sustainable and
          productive beekeeping.
        </Typography>
      </Box>

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setErrorMessage("")}
        >
          {errorMessage}
        </Alert>
      )}

      <Divider sx={{ my: 4 }} />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <>
          {/* Stats Overview Cards */}
          <Typography
            variant="h5"
            fontWeight="700"
            color="primary"
            sx={{ mb: 2 }}
          >
            🏠 Hive Overview
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Total Hives */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.05),
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <HiveIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Total Hives
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {totalHives}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Managed bee colonies
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Active Hives */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.05),
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CheckCircleIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Active Hives
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {activeHives}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalHives > 0
                      ? `${((activeHives / totalHives) * 100).toFixed(1)}% operational`
                      : "No data"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Avg Strength */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.05),
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <WarningIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Avg. Strength
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {averageStrength}/10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall hive health
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Pest Level */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.05),
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BugReportIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Pest Level
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {averagePestLevel}/10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hivesWithDisease} hives with disease signs
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Bar Chart */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color="primary"
                    gutterBottom
                  >
                    Hive Performance Overview
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={strengthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar
                          dataKey="strength"
                          fill="#FFB700"
                          name="Strength"
                        />
                        <Bar
                          dataKey="pest"
                          fill={alpha("#FFB700", 0.7)}
                          name="Pest Level"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Pie Chart */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color="primary"
                    gutterBottom
                  >
                    Hive Status Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          dataKey="value"
                          fill="#FFB700"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {statusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={alpha("#FFB700", 0.6 + index * 0.1)} // shade variations
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Beekeeper Stats */}
          <Typography
            variant="h5"
            fontWeight="700"
            color="primary"
            sx={{ mb: 2 }}
          >
            👩‍🌾 Beekeeper Overview
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4, justifyContent: "center" }}>
            {/* Total Beekeepers */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.05),
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PeopleIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Total Beekeepers
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {totalBeekeepers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Registered beekeepers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Active Beekeepers */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.05),
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PersonIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Active Beekeepers
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {activeBeekeepers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalBeekeepers > 0
                      ? `${((activeBeekeepers / totalBeekeepers) * 100).toFixed(1)}% active`
                      : "No data"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Available Beekeepers */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.05),
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EventAvailableIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Available Beekeepers
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {availableBeekeepers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalBeekeepers > 0
                      ? `${((availableBeekeepers / totalBeekeepers) * 100).toFixed(1)}% available`
                      : "No data"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Beekeeper Charts */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* Beekeeper Status */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color="primary"
                    gutterBottom
                  >
                    Beekeeper Status
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={beekeeperStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {beekeeperStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index % 2 === 0
                                  ? "#FFB700"
                                  : alpha("#FFB700", 0.7)
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Beekeeper Availability */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color="primary"
                    gutterBottom
                  >
                    Beekeeper Availability
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={availabilityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {availabilityData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index % 2 === 0
                                  ? "#FFB700"
                                  : alpha("#FFB700", 0.7)
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Product Stats */}
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ mb: 2, color: "#FFB700" }}
          >
            🍯 Product Overview
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4, justifyContent: "center" }}>
            {/* Total Products */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.08),
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <InventoryIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="primary"
                      gutterBottom
                    >
                      Total Products
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: "#FFB700" }}
                  >
                    {totalProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inventory items
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Approved Products */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.08),
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CheckCircleIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="primary"
                      gutterBottom
                    >
                      Approved Products
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: "#FFB700" }}
                  >
                    {approvedProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalProducts > 0
                      ? `${((approvedProducts / totalProducts) * 100).toFixed(1)}% approved`
                      : "No data"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Inventory Value */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  bgcolor: alpha("#FFB700", 0.08),
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MoneyIcon sx={{ color: "#FFB700", mr: 1 }} />
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="primary"
                      gutterBottom
                    >
                      Inventory Value
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: "#FFB700" }}
                  >
                    ${totalInventoryValue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total product value
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            {/* Product Status Distribution */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color="primary"
                    gutterBottom
                  >
                    Product Status Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {productStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                ["#FFB700", "#FF9800", "#FFCC33", "#FFC107"][
                                  index % 4
                                ]
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Product Types */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color="primary"
                    gutterBottom
                  >
                    Product Types
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {productTypeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                ["#FFB700", "#FF9800", "#FFCC33", "#FFC107"][
                                  index % 4
                                ]
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
        </>
      )}
    </Container>
  );
};

export default Dashboard;
