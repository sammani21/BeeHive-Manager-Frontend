import { useState, FormEvent } from "react";
import "../App.css";
import axios, { AxiosResponse } from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Grid, Box, TextField, Button, Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BusImage from "../assets/busimage.jpg";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter"; // Import the PasswordStrengthMeter component

const Signup: React.FC = () => {
  const [company, setCompanyName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  // Password strength validation function
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

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Check if the password meets the strength criteria
    if (!isStrongPassword(password)) {
      setErrorMessage(
        "Password should contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters"
      );
      return;
    }

    // Send a POST request to the server to create a new user
    axios
      .post("http://localhost:3000/api/v1/user/signup", {
        company,
        username,
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

  return (
    <div className="sign-up-container">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#EDE8F5",
        }}
      >
        {/* Left side with BusImage */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${BusImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            minHeight: "100vh",
            "@media (min-width: 200vh)": {
              flex: 0.4,
            },
          }}
        ></Box>

        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            flex: 1,
            padding: "20px",
            "@media (min-width: 600px)": {
              flex: 0.5,
            },
          }}
        >
          <form className="sign-up-form" onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              className="typoColor"
            >
              Sign Up
            </Typography>

            <TextField
              required
              type="text"
              id="companyName"
              label="Company Name"
              variant="filled"
              value={company}
              onChange={(e) => setCompanyName(e.target.value)}
              margin="normal"
              className="textfiledStyle"
              fullWidth
            />

            <TextField
              required
              type="text"
              id="username"
              label="Username"
              variant="filled"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              className="textfiledStyle"
              fullWidth
            />

            <TextField
              required
              type="email"
              id="email"
              label="Email"
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              className="textfiledStyle"
              fullWidth
            />

            <TextField
              required
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              label="Password"
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              className="textfiledStyle"
              fullWidth
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

            {/* Password strength meter */}
            {password && <PasswordStrengthMeter password={password} />}

            {errorMessage && (
              <Alert severity="error" sx={{ marginY: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <Button
              type="submit"
              color="secondary"
              size="large"
              variant="contained"
              className="button-instance"
              fullWidth
              sx={{ marginY: 2,
                backgroundColor: "#FFB700",
                "&:hover": {
                backgroundColor: "#CC9200",
              },
               }}
            >
              SIGN UP
            </Button>
            <Typography variant="body2">
              Have an account? <Link to="/login">Login</Link>
            </Typography>
          </form>
        </Grid>
      </Box>
    </div>
  );
};

export default Signup;
