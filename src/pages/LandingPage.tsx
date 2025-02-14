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

import bgImage from "../assets/bg_image.jpg"; // Import the image

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${bgImage})`, // Use imported image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(237, 232, 245, 0.9)", // Adds a transparent overlay
      }}
    >
      <AppBar position="sticky" sx={{ backgroundColor: "#FFB700" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            align="left"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            BeeHive Manager
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 5,
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
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 8, mb: 4 }}>
        <Box sx={{ textAlign: "center", my: 8 }}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ color: "#1D1A11" }} // Set text color to white
          >
            Welcome to <strong>BeeHive Manager</strong>, the all-in-one platform
            for modern beekeeping. Manage your hives, monitor health, track
            production, and connect with the beekeeping community— all while
            contributing to a sustainable future.
          </Typography>

          {/* Buttons in the same line */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 5 }}
          >
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
            },
            {
              id: 2,
              title: "Manage BeeKeepers",
              description:
                "Keep track of beekeepers, their activities, and manage their roles in the system.",
            },
            {
              id: 3,
              title: "Seamless Communication",
              description:
                "Ensure smooth communication between hive managers, beekeepers, and others.",
            },
          ].map((feature) => (
            <Grid item key={feature.id} xs={10} md={4}>
              <Card
                sx={{
                  minHeight: "200px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  color: "#000",
                }}
              >
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
      <Box
        sx={{
          backgroundColor: "#FFB700",
          py: 4,
          //textAlign: "center",
          color: "#fff",
        }}
      >
        <Typography variant="body2" align="center" component="p">
          &copy; {new Date().getFullYear()} Romodo. All rights reserved.
          <Button color="inherit" onClick={() => navigate("/about")}>
            About Us
          </Button>
          <Button color="inherit" onClick={() => navigate("/contact")}>
            Contact
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
