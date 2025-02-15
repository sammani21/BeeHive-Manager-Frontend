import { useState } from "react";
import "../App.css";
//import axios, { AxiosResponse } from "axios";
//import { Link, useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";
import BusImage from "../assets/Beeimage.png";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword: React.FC = () => {

  const [email, setEmail] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  //const navigate = useNavigate();

  //axios.defaults.withCredentials = false;

  

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
      setError(null);
    } catch (error: any) {
      setError("Failed to send reset email. Please try again.");
      setMessage(null);
    }
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

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "20px", md: "40px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
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
            sx={{ color: "#000000", mb: 4 }}
          >
            Enter your details to reset your password
          </Typography>

          

          
          <TextField
        label="Enter Your Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 4 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePasswordReset}
        fullWidth
        sx={{ backgroundColor: "#FFB700", "&:hover": { backgroundColor: "#CC9200" } }}
      >
        Send Reset Email
      </Button>

      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>

         
        </Box>
      </Box>

  );
};

export default ForgotPassword;
