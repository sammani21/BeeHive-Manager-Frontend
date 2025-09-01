import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

import bgImage from "../assets/bg_image.jpg"; // Import the background image
import logo from "../assets/BHM_logo.jpg"; // Import the logo
import hiveImage from "../assets/hive_management.png";
import beekeepersImage from "../assets/beekeepers.png";
import communicationImage from "../assets/communication.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(237, 232, 245, 0.9)",
      }}
    >
      <AppBar position="sticky" sx={{ backgroundColor: "#000000" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="BeeHive Manager Logo" style={{ height: "50px", marginRight: "10px" }} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "#FFB700",
                "&:hover": {
                  backgroundColor: "#FFB700",
                },
              }}
              onClick={() => navigate("/login")}
            >
              LOGIN
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 8, mb: 4 }}>
        <Box sx={{ textAlign: "center", my: 8 }}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ color: "#1D1A11" }}
          >
            Welcome to <strong>BeeHive Manager</strong>, the all-in-one platform
            for modern beekeeping. Manage your hives, monitor health, track
            production, and connect with the beekeeping community— all while
            contributing to a sustainable future.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 5 }}>
            <Button
              variant="contained"
              startIcon={<RocketLaunchIcon />}
              sx={{
                color: "white",
                backgroundColor: "#FFB700",
                "&:hover": {
                  backgroundColor: "#E6A500",
                },
              }}
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  backgroundColor: "#FFB700",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Box>

          <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.3)" }} />
        </Box>

        <Grid container spacing={2} justifyContent="center">
  {[
    {
      id: 1,
      title: "Hive Management",
      description:
        "Manage your hives efficiently and keep track of their health and productivity.",
      image: hiveImage,
    },
    {
      id: 2,
      title: "Manage BeeKeepers",
      description:
        "Keep track of beekeepers, their activities, and manage their roles in the system.",
      image: beekeepersImage,
    },
    {
      id: 3,
      title: "Production Tracking",
  description:
    "Monitor and analyze honey production, hive performance, and yield trends in real-time.",
      image: communicationImage,
    },
  ].map((feature) => (
    <Grid item key={feature.id} xs={10} md={4}>
      <Card
        sx={{
          minHeight: "300px",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          color: "#000",
        }}
      >
        <img
          src={feature.image}
          alt={feature.title}
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h5" component="h3" gutterBottom>
            {feature.title}
          </Typography>
          <Typography>{feature.description}</Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
      </Container>
      <Box sx={{ backgroundColor: "#FFB700", py: 1, px: 3, color: "#fff" }}>
  <Container maxWidth="lg">
    <Grid container justifyContent="space-between" alignItems="center">
      {/* Left Side */}
      <Grid item>
        <Typography variant="body2" component="p">
          &copy; {new Date().getFullYear()} BeeHive Manager. All rights reserved.
        </Typography>
      </Grid>

      

      {/* Right Side */}
      <Grid item>
        <Button color="inherit" onClick={() => navigate("/terms")}>
          Terms of Service
        </Button>
        <Button color="inherit" onClick={() => navigate("/privacy")}>
          Privacy Policy
        </Button>
        <Button color="inherit" onClick={() => navigate("/cookies")}>
          Cookies
        </Button>
      </Grid>
    </Grid>
  </Container>
</Box>

    </Box>
  );
};

export default LandingPage;
