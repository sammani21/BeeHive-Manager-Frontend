import { useState, FormEvent } from "react";
import "../App.css";
import axios, { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Alert, Box, Grid } from "@mui/material";
import BusImage from "../assets/Beeimage.png"; // Using your original image

const ForgotPassword: React.FC = () => {
  const [adminId, setAdminId] = useState<string>(""); // Changed from username → adminId
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  axios.defaults.withCredentials = false;

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/v1/user/forgotPassword", {
        email,
        adminId, // Changed here too
      })
      .then((res: AxiosResponse<{ status: boolean }>) => {
        if (res.data.status) {
          alert("Check your email for the password reset link.");
          navigate("/login");
        } else {
          setErrorMessage("Incorrect Admin ID or email.");
        }
      })
      .catch((err) => {
        console.error(err.response?.data?.message);
        if (err.response?.data?.message === "User is not registered.") {
          setErrorMessage("User is not registered. Please sign up.");
        } else {
          setErrorMessage("Invalid Admin ID or email. Please try again.");
        }
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        width: "100vw",
        backgroundColor: "#EDE8F5",
      }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${BusImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
      />

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          flex: 1,
          padding: { xs: "20px", md: "40px" },
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#000000" }}
          >
            Forgot Password
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "#000000", mb: 4 }}
          >
            Enter your details to reset your password
          </Typography>

          <TextField
            required
            type="text"
            id="adminId"
            label="Admin ID"
            variant="outlined"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            margin="normal"
            fullWidth
          />

          <TextField
            required
            type="email"
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            fullWidth
          />

          {errorMessage && (
            <Alert severity="error" sx={{ marginY: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              backgroundColor: "#FFB700",
              "&:hover": { backgroundColor: "#CC9200" },
              marginTop: 2,
            }}
          >
            SUBMIT
          </Button>

          <Typography variant="body2" sx={{ marginTop: 2 }}>
            <Link to="/login">Back to Login</Link>
          </Typography>
        </form>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;
