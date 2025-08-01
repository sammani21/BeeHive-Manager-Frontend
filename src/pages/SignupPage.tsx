import { useState, FormEvent } from "react";
import "../App.css";
import { useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BusImage from "../assets/Beeimage.png";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
//import { auth } from "../firebaseConfig";
//import { createUserWithEmailAndPassword } from "firebase/auth";
import axios, { AxiosResponse } from "axios";

const Signup: React.FC = () => {
  const [company, setCompany] = useState("");
  const [adminId, setAdminId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const isStrongPassword = (password: string): boolean => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    return (
      password.length >= 8 &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password) &&
      specialCharacterRegex.test(password)
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isStrongPassword(password)) {
      setErrorMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    axios
      .post("http://localhost:3000/api/v1/user/signup", {
        company,
        adminId,
        email,
        password,
      })
      .then((res: AxiosResponse<{ status: boolean }>) => {
        if (res.data.status) {
          alert("User created the account successfully");
          console.log("User created the account successfully");
          navigate("/login");
        }
      })
      .catch((err) => {
        const error = "User already exists";
        setErrorMessage(error);
        alert(error);
        console.log(err);
      });
  };

  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password);
  //     console.log("User registered successfully");
  //     navigate("/login");
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     console.error("Signup Error:", error);
  //     setErrorMessage(error.message || "Failed to create an account");
  //   }
  // };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: "100vh", width: "100vw", backgroundColor: "#EDE8F5" }}>
      <Box sx={{ flex: 1, backgroundImage: `url(${BusImage})`, backgroundSize: "cover", backgroundPosition: "center", display: { xs: "none", md: "block" } }} />
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: { xs: "20px", md: "40px" } }}>
        <Box sx={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#000000" }}>
            Get Started With BeeHive Manager
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "#000000" }}>
            Getting started is easy
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "transparent", // Match the parent background
              border: "none", // Remove any border
              //padding: 0, // Remove padding to blend with parent
            }}
          >
            <TextField
              required
              type="text"
              label="Full Name"
              variant="outlined"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px", mt: -2 }}
            />
            <TextField
              required
              type="text"
              label="Admin ID"
              variant="outlined"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }}
            />
            <TextField
              required
              type="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }}
            />
            <TextField
              required
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {password && <PasswordStrengthMeter password={password} />}
            {errorMessage && <Alert severity="error" sx={{ marginY: 2 }}>{errorMessage}</Alert>}
            <Button
              type="submit"
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              sx={{ marginY: 2, backgroundColor: "#FFB700", "&:hover": { backgroundColor: "#CC9200" }, fontWeight: "bold", fontSize: "1rem" }}
            >
              Sign Up
            </Button>
            <Typography variant="body2" sx={{ color: "#666666", mb: -5 }}>
              Already have an account? <Link to="/login" style={{ color: "#FFB700", textDecoration: "none" }}>Login</Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;