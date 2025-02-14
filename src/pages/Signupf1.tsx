import { useState, FormEvent } from "react";
import "../App.css";
import axios, { AxiosResponse } from "axios";
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
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";

const Signup: React.FC = () => {
  const [company, setCompany] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!isStrongPassword(password)) {
      setErrorMessage(
        "Password should contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters"
      );
      return;
    }

    axios
      .post("http://localhost:3000/api/v1/user/signup", {
        company,
        username,
        email,
        password,
      })
      .then((res: AxiosResponse<{ status: boolean }>) => {
        if (res.data.status) {
          console.log("User created the account successfully");
          navigate("/login");
        }
      })
      .catch(() => {
        setErrorMessage("User already exists");
      });
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In Success:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setErrorMessage("Failed to sign in with Google");
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
        <Box sx={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#000000" }}>
            Get Started With BeeHive Manager
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "#000000" }}>
            Getting started is easy
          </Typography>
          <Button onClick={handleGoogleSignup} color="secondary" size="large" variant="contained" fullWidth sx={{ marginBottom: 2 }}>Sign Up with Google</Button>
          <form onSubmit={handleSubmit} style={{ maxHeight: "380px" }}>
            
            <TextField required type="text" id="company" label="Full Name" variant="outlined" value={company} onChange={(e) => setCompany(e.target.value)} margin="normal" fullWidth sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }} />
            <TextField required type="text" id="username" label="Enter Email" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" fullWidth sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }} />
            <TextField required type={showPassword ? "text" : "password"} id="password" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" fullWidth sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton></InputAdornment>), }} />
            <TextField
              required
              type={showPassword ? "text" : "password"}
              id="password"
              label="Confirm Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={(e) => e.preventDefault()} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {password && <PasswordStrengthMeter password={password} />}
            {errorMessage && <Alert severity="error" sx={{ marginY: 2 }}>{errorMessage}</Alert>}
            <Button type="submit" color="primary" size="large" variant="contained" fullWidth sx={{ marginY: 2, backgroundColor: "#FFB700", "&:hover": { backgroundColor: "#CC9200" }, fontWeight: "bold", fontSize: "1rem", }}>Sign Up</Button>
            <Typography variant="body2" sx={{ color: "#666666" }}>
            Already have an account? <Link to="/login" style={{ color: "#FFB700", textDecoration: "none" }}>Login</Link>
          </Typography>
          </form>
          
          
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
