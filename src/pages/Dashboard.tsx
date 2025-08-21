

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
 import NavigationBar from "../components/NavigationBar";
import ComparisonBarChart from "../components/ProductsDashboard";
import BarChart from "../components/HivesDashboard";
import PieChart from "../components/BeekeepersDashboard";
import DoughnutChart from "../components/RecommendationsDashboard";
//import LineChartForNoOfTripsDashboard from "../components/LineChartForNoOfTripsDashboard";
import { format } from "date-fns";



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
    h1: {
      fontWeight: 900,
      fontSize: "3rem",
      textTransform: "uppercase",
      marginBottom: "1rem",
      marginLeft: "300px",
      textAlign: "center",
      letterSpacing: "0.5px",
      background: "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      padding: "0.5rem",
    },
    h6: {
      fontWeight: "bold",
      textAlign: "center",
    },
  },
});

const DashboardPage: React.FC = () => {
  const [hiveCounts, setHiveCounts] = useState({
    totalHives: 0,
    inProductionHives: 0,
    outOfProductionHives: 0,
  });

  const [beekeeperCounts, setBeekeeperCounts] = useState({
    noOfTotalBeekeepers: 0,
    noOfAvailableBeekeepers: 0,
    noOfUnavailableBeekeepers: 0,
  });

  const [tripCounts, setTripCounts] = useState({
    numberOfTotalTrips: 0,
    scheduledTrips: 0,
    cancelledTrips: 0,
  });

  const [comparisonChartData, setComparisonChartData] = useState({
    years: [],
    malfunctionData: [],
    accidentData: [],
  });

  const [completedTripCounts, setCompletedTripCounts] = useState<TripCount[]>([]);

  useEffect(() => {
    fetchHiveCounts();
    fetchBeekeeperCounts();
    fetchTripCounts();
    fetchComparisonData();
    fetchTripCountsDaily();
    // fetchTraveledKmCounts();

    const intervalId = setInterval(() => {
      fetchHiveCounts();
      fetchBeekeeperCounts();
      fetchTripCounts();
      fetchComparisonData();
      fetchTripCountsDaily();
      // fetchTraveledKmCounts();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchHiveCounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/hives/counts"
      );
      const { hives } = response.data;
      setHiveCounts({
        totalHives: hives.total,
        inProductionHives: hives.inProduction,
        outOfProductionHives: hives.outOfProduction,
      });
    } catch (error) {
      console.error("Error fetching hive counts:", error);
    }
  };

  const fetchBeekeeperCounts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/beekeepers/counts");
      const { available, unavailable } = response.data.beekeepers;
      setBeekeeperCounts({
        noOfTotalBeekeepers: response.data.beekeepers.total,
        noOfAvailableBeekeepers: available,
        noOfUnavailableBeekeepers: unavailable,
      });
    } catch (error) {
      console.error("Error fetching beekeeper counts:", error);
    }
  };

  const fetchTripCounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/trips/counts"
      );
      const { scheduledTrips, cancelledTrips, totalTrips } =
        response.data.trips;
      setTripCounts({
        numberOfTotalTrips: totalTrips,
        scheduledTrips: scheduledTrips,
        cancelledTrips: cancelledTrips,
      });
    } catch (error) {
      console.error("Error fetching trip counts:", error);
    }
  };

  const fetchComparisonData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/issues/counts"
      );
      const data = response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const years = data.map((item: any) => item.year.toString());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const malfunctionData = data.map((item: any) => item.malfunctions);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accidentData = data.map((item: any) => item.accidents);
      setComparisonChartData({ years, malfunctionData, accidentData });
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    }
  };

  interface TripCount {
    date: string;
    count: number;
  }
  
  const fetchTripCountsDaily = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/trips/daily-completed");
      const dailyData = response.data;

      console.log("Raw API Response:", dailyData);

      if (!Array.isArray(dailyData)) {
        throw new Error("Expected an array of daily trip data");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData: TripCount[] = dailyData.map((item: any) => {
        try {
          const date = new Date(`${item.year}-${item.month}-${item.day}`);
          const formattedDate = format(date, 'yyyy-MM-dd');

          return {
            date: formattedDate,
            count: item.count,
          };
        } catch (error) {
          console.error("Error parsing date or count:", error);
          return null;
        }
      }).filter((data: TripCount | null): data is TripCount => data !== null);

      console.log("Transformed Data:", transformedData);

      setCompletedTripCounts(transformedData);
    } catch (error) {
      console.error("Error fetching daily completed trips:", error);
    }
  };

  
  const { totalHives, inProductionHives, outOfProductionHives } =
    hiveCounts;
  const { noOfTotalBeekeepers, noOfAvailableBeekeepers, noOfUnavailableBeekeepers } =
    beekeeperCounts;
  const { numberOfTotalTrips, scheduledTrips, cancelledTrips } = tripCounts;
  const { years, malfunctionData, accidentData } = comparisonChartData;

  return (
    <ThemeProvider theme={theme}>
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <NavigationBar />
        <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" textAlign="left" color="primary">
              Dashboard
            </Typography>
          <Grid container spacing={2} sx={{ marginTop: "2rem", marginBottom: "2rem", justifyContent: "center" }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "400px", width :"320px" , display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", background: "#f0f0f0", borderRadius: "30px" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hive Status
                  </Typography>
                  <BarChart
                    noOfTotalHives={totalHives}
                    noOfInProductionHives={inProductionHives}
                    noOfOutOfProductionHives={outOfProductionHives}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Card sx={{ height: "400px", width :"320px" ,display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", background: "#f0f0f0", borderRadius: "30px" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                   Bee Keeper Status
                  </Typography>
                  <PieChart
                    noOfAvailableBeekeepers={noOfAvailableBeekeepers}
                    noOfUnavailableBeekeepers={noOfUnavailableBeekeepers}
                  />
                  <Typography variant="body1">
                    <b>Number of Total Bee Keepers: {noOfTotalBeekeepers}</b>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Card sx={{ height: "400px", width :"320px" ,display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", background: "#f0f0f0", borderRadius: "30px" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommendation Status
                  </Typography>
                  <DoughnutChart
                    numberOfTotalTrips={numberOfTotalTrips}
                    scheduledTrips={scheduledTrips}
                    cancelledTrips={cancelledTrips}
                  />
                  <Typography variant="body1">
                    <b>Number of Total Recommendations: {numberOfTotalTrips}</b>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Card sx={{ height: "400px", width :"320px" ,display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", background: "#f0f0f0", borderRadius: "30px" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Production Comparison
                  </Typography>
                  <ComparisonBarChart
                    years={years}
                    malfunctionData={malfunctionData}
                    accidentData={accidentData}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* <Grid item xs={12} sm={6} md={4} lg={3} sx={{ marginRight: "400px" }}>
  <Card sx={{ height: "530px", width: "900px" ,display: "flex", flexDirection: "column", justifyContent: "space-between",  background: "#f0f0f0", borderRadius: "30px" }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        High Performing Bee Keepers
      </Typography>
      <LineChartForNoOfTripsDashboard completedTripCounts={completedTripCounts} />
    </CardContent>
  </Card>
</Grid> */}
            
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default DashboardPage;
