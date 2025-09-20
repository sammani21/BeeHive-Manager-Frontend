import { useState, FormEvent } from "react";
import "../App.css";
import axios, { AxiosResponse } from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Button, Box, TextField, Alert } from "@mui/material";
import BeeImage from "../assets/Beeimage.png";

const ForgotPassword: React.FC = () => {
  const [adminId, setAdminId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  axios.defaults.withCredentials = false;

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/api/v1/user/forgotPassword", {
        email,
        adminId,
      })
      .then((res: AxiosResponse<{ status: boolean }>) => {
        if (res.data.status) {
          console.log("Email sent");
          alert("Check your email for the password reset link.");
          navigate("/login");
        } else {
          setErrorMessage("Incorrect Admin ID or email.");
        }
      })
      .catch((err) => {
        console.error(err.response?.data?.message || err.message);
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
      {/* Left Section: Background Image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${BeeImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
      />

      {/* Right Section: Forgot Password Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "20px", md: "40px" },
          backgroundColor: "#EDE8F5",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
            backgroundColor: "transparent",
          }}
        >
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
            sx={{ color: "#000000", mb: 2 }}
          >
            Enter your Admin ID and email to reset your password
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
          >
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
              sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px", mt: -2 }}
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
              sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }}
            />

            {errorMessage && (
              <Alert severity="error" sx={{ marginY: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              sx={{
                marginY: 2,
                backgroundColor: "#FFB700",
                "&:hover": { backgroundColor: "#CC9200" },
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Submit
            </Button>

            <Typography variant="body2" sx={{ color: "#666666" }}>
              Remembered your password?{" "}
              <Link
                to="/login"
                style={{ color: "#FFB700", textDecoration: "none" }}
              >
                Back to Login
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
