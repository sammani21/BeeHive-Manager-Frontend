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

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
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
      .post("http://localhost:3000/api/v1/user/login", {
        username,
        password,
      })
      .then((res: AxiosResponse<{ status: boolean; token: string }>) => {
        if (res.data.status) {
          console.log("User logged in successfully");
          localStorage.setItem("token", res.data.token);
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);

        if (err.response.data.message === "User is not registered") {
          setErrorMessage("You need to sign up before logging in!");
        } else {
          setErrorMessage("Invalid username or password. Please try again.");
        }
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // Stack vertically on small screens, side by side on larger screens
        height: "100vh",
        width: "100vw",
        backgroundColor: "#EDE8F5",
      }}
    >
      {/* Left Section: Background Image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${BusImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" }, // Hide on small screens
        }}
      />

      {/* Right Section: Login Form */}
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
            Welcome Back
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "#000000" }}
          >
            Login into your account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              required
              type="text"
              id="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }}
            />

            <TextField
              required
              type={showPassword ? "text" : "password"}
              id="password"
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
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {password && <PasswordStrengthMeter password={password} />}

            <Typography
              variant="body2"
              align="right"
              sx={{ marginY: 1, color: "#ff4444" }}
            >
              <Link
                to="/forgotPassword"
                style={{ color: "#ff4444", textDecoration: "none" }}
              >
                Recover Password
              </Link>
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ marginY: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              sx={{
                marginY: 2,
                backgroundColor: "#FFB700",
                "&:hover": {
                  backgroundColor: "#CC9200",
                },
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Login
            </Button>

            <Typography variant="body2" sx={{ color: "#666666" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{ color: "#FFB700", textDecoration: "none" }}
              >
                Sign Up
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
