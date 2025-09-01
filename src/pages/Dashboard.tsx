import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  ThemeProvider,
  createTheme,
  Box,
  Divider,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import BarChart from "../components/HivesDashboard";
import PieChart from "../components/BeekeepersDashboard";
import DoughnutChart from "../components/RecommendationsDashboard";
import ComparisonBarChart from "../components/ProductsDashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#0083b0",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h4: {
      fontWeight: "bold",
    },
    h6: {
      fontWeight: "bold",
    },
    body2: {
      color: "#555",
    },
  },
});

const DashboardPage: React.FC = () => {
  // Dummy data
  const [hiveData] = useState({
    totalHives: 15,
    inProductionHives: 14,
    outOfProductionHives: 1,
  });

  const [beekeeperData] = useState({
    totalBeekeepers: 5,
    availableBeekeepers: 3,
    unavailableBeekeepers: 2,
  });

  const [recommendationData] = useState({
    totalRecommendations: 2,
    pendingRecommendations: 1,
    completedRecommendations: 1,
    dismissedRecommendations: 0,
  });

  const [productData] = useState({
    years: ["2023", "2024"],
    honeyProduction: [120, 150],
    waxProduction: [35, 42],
  });

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Dashboard data loaded");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafe" }}>
        <NavigationBar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
<Typography 
  variant="h4" 
  fontWeight="bold" 
  color="primary" 
  gutterBottom
>
  🐝 Beekeeping Dashboard
</Typography>

<Typography variant="body1" color="text.secondary" paragraph>
  Welcome to the central hub of your beekeeping operations. 
  Here you can monitor hive health, manage beekeepers, track recommendations, 
  and analyze production trends — all in one place. 
  Use the live insights and visual charts to make better decisions 
  for sustainable and productive beekeeping.
</Typography>
          <Grid container spacing={3}>
            {/* Hive Status */}
            {/* Hive Status */}
<Grid item xs={12} sm={6} md={6} lg={3}>
  <Card
    sx={{
      height: "100%",
      borderRadius: 3,
      boxShadow: 4,
      p: 1,
      transition: "all 0.3s",
      "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      {/* Title */}
      <Typography variant="h6" color="primary" gutterBottom>
        Hive Status
      </Typography>

      {/* Chart (smaller + centered) */}
      <Box
        sx={{
          height: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BarChart
          noOfTotalHives={hiveData.totalHives}
          noOfInProductionHives={hiveData.inProductionHives}
          noOfOutOfProductionHives={hiveData.outOfProductionHives}
        />
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Footer */}
      <Typography variant="body2">
        <b>Total Hives: {hiveData.totalHives}</b>
      </Typography>
    </CardContent>
  </Card>
</Grid>


            {/* Beekeeper Status */}
            {/* Beekeeper Status */}
<Grid item xs={12} sm={6} md={6} lg={3}>
  <Card
    sx={{
      height: "100%",
      borderRadius: 3,
      boxShadow: 4,
      p: 1,
      transition: "all 0.3s",
      "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      {/* Title */}
      <Typography variant="h6" color="primary" gutterBottom>
        Beekeeper Status
      </Typography>

      {/* Chart (larger for better visibility) */}
      <Box
        sx={{
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PieChart
          noOfAvailableBeekeepers={beekeeperData.availableBeekeepers}
          noOfUnavailableBeekeepers={beekeeperData.unavailableBeekeepers}
        />
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Footer */}
      <Typography variant="body2">
        <b>Total Beekeepers: {beekeeperData.totalBeekeepers}</b>
      </Typography>
    </CardContent>
  </Card>
</Grid>


            {/* Recommendations */}
            {/* Recommendations */}
<Grid item xs={12} sm={6} md={6} lg={3}>
  <Card
    sx={{
      height: "100%",
      borderRadius: 3,
      boxShadow: 4,
      p: 1,
      transition: "all 0.3s",
      "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Recommendations
      </Typography>

      {/* Chart (same size as Beekeeper Status for balance) */}
      <Box
        sx={{
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DoughnutChart
          numberOfTotalTrips={recommendationData.totalRecommendations}
          scheduledTrips={recommendationData.pendingRecommendations}
          cancelledTrips={recommendationData.completedRecommendations}
        />
      </Box>

      <Divider sx={{ my: 1 }} />

      <Typography variant="body2">
        <b>Total: {recommendationData.totalRecommendations}</b>
      </Typography>
    </CardContent>
  </Card>
</Grid>

            {/* Production Comparison */}
            {/* Production Comparison */}
{/* Production Comparison */}
{/* Production Comparison */}
<Grid item xs={12} sm={6} md={6} lg={3}>
  <Card
    sx={{
      height: "100%",
      borderRadius: 3,
      boxShadow: 4,
      p: 1,
      transition: "all 0.3s",
      "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      {/* Title */}
      <Typography
        variant="h6"
        color="primary"
        gutterBottom
        fontWeight="bold"
      >
        Production Comparison
      </Typography>

      {/* Chart (smaller height) */}
      <Box sx={{ height: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ComparisonBarChart
          years={productData.years}
          malfunctionData={productData.honeyProduction}
          accidentData={productData.waxProduction}
          //showTitle={false} // chart should not render internal titles
        />
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Footer/Subtext */}
      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
        Honey vs Wax Production
      </Typography>
    </CardContent>
  </Card>
</Grid>




            {/* System Overview */}
            <Grid item xs={12}>
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 4,
      p: 3,
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    }}
  >
    <CardContent>
      {/* Title */}
      <Typography
        variant="h6"
        gutterBottom
        color="primary"
        textAlign="center"
        fontWeight="bold"
      >
        System Overview
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} justifyContent="center">
        {[
          { label: "Total Hives", value: hiveData.totalHives, icon: "🐝" },
          { label: "Beekeepers", value: beekeeperData.totalBeekeepers, icon: "👨‍🌾" },
          { label: "Recommendations", value: recommendationData.totalRecommendations, icon: "📋" },
          { label: "Active Hives", value: hiveData.inProductionHives, icon: "✅" },
        ].map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "white",
                boxShadow: 2,
                transition: "all 0.3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                textAlign: "center",
              }}
            >
              {/* Icon */}
              <Typography variant="h5" sx={{ mb: 1 }}>
                {stat.icon}
              </Typography>

              {/* Value */}
              <Typography
                variant="h4"
                color="primary"
                fontWeight="bold"
                sx={{ lineHeight: 1.2 }}
              >
                {stat.value}
              </Typography>

              {/* Label */}
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
</Grid>

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardPage;
