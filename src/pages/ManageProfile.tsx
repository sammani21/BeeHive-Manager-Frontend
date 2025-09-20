import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Avatar,
  Alert,
  Container,
  Grid,
  ThemeProvider,
  createTheme,
  IconButton,
  Typography,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  LocationOn,
  Home,
} from "@mui/icons-material";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: { main: "#FFB700" }, // Indigo
    secondary: { main: "#10B981" }, // Emerald
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: "1.8rem",
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.9rem",
    },
  },
});

const ManageProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status) {
          setUser(response.data.data);
          const names = response.data.data.fullname?.split(" ") || [];
          setFormData({
            firstName: names[0] || "",
            lastName: names.length > 1 ? names.slice(1).join(" ") : "",
            email: response.data.data.email || "",
            phone: response.data.data.phone || "",
            country: response.data.data.country || "",
            city: response.data.data.city || "",
            address: response.data.data.address || "",
            zipCode: response.data.data.zipCode || "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const updateData = {
        fullname: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        zipCode: formData.zipCode,
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await axios.put("/api/user/me", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        setMessage("Profile updated successfully!");
        // Clear password fields
        setFormData({
          ...formData,
          password: "",
          confirmPassword: "",
        });
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/user/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        setUser({ ...user, photoURL: response.data.imageUrl });
        setMessage("Profile picture updated successfully!");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setError("Failed to upload image");
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <NavigationBar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Manage Your Profile
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          maxWidth="sm"
          mx="auto"
        >
          Keep your profile up to date. Update personal details, contact
          information, and security settings to make your account more secure.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={user?.photoURL}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: "auto",
                      border: "4px solid",
                      borderColor: "primary.main",
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="upload-photo"
                  />
                  <label htmlFor="upload-photo">
                    <IconButton
                      component="span"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": { backgroundColor: "primary.dark" },
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </label>
                </Box>

                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  {user?.fullname}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user?.email}
                </Typography>

                <Box sx={{ mt: 3, textAlign: "left" }}>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <Phone
                      sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }}
                    />
                    <Typography variant="body1">
                      {formData.phone || "Not provided"}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1.5}>
                    <LocationOn
                      sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }}
                    />
                    <Typography variant="body1">
                      {formData.city && formData.country
                        ? `${formData.city}, ${formData.country}`
                        : "Location not set"}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Home
                      sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }}
                    />
                    <Typography variant="body1">
                      {formData.address || "Address not provided"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Personal Information
                </Typography>

                {message && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {message}
                  </Alert>
                )}
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    width: "100%", // takes full available width
                    maxWidth: "900px", // increase as you like (default MUI form usually ~600px)
                    mx: "auto", // center horizontally
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        placeholder="Kavi"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        placeholder="Rajasooriya"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="kavisamrajasooriya@gmail.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        placeholder="0712345678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Address Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Home color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Zip Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Change Password
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                edge="end"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={saving}
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: "1rem",
                          mt: 2,
                        }}
                      >
                        {saving ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ManageProfile;
