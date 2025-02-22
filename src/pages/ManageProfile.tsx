import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Alert,
  Container,
  Card,
  CardContent,
  Grid,
  ThemeProvider,
  createTheme,
  IconButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import NavigationBar from "../components/NavigationBar";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#0083b0" },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h1: {
      fontWeight: 900,
      fontSize: "2.5rem",
      textAlign: "center",
      letterSpacing: "0.5px",
      padding: "0.5rem",
    },
  },
});

const ManageProfile: React.FC = () => {
  const auth = getAuth();
  const storage = getStorage();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(
    user?.displayName?.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState(
    user?.displayName?.split(" ")[1] || ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setMessage(null);
      return;
    }
    try {
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      if (email && email !== user.email) await updateEmail(user, email);
      if (password) await updatePassword(user, password);
      setMessage("Profile updated successfully!");
      setError(null);
    } catch {
      setError("Failed to update profile. Please try again.");
      setMessage(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
    setImageFile(file);
    handleUploadImage(file);
    }
  };

  const handleUploadImage = async (file: File) => {
    if (!user) return;
  
    try {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        null,
        (error) => setError(`Image upload failed: ${error.message}`),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: downloadURL });
          
          // Update state to reflect new profile picture
          setPhotoURL(downloadURL);
          setMessage("Profile picture updated successfully!");
  
          // Force Firebase user refresh to reflect the new image
          await auth.currentUser?.reload();
        }
      );
    } catch (error) {
      setError(`Upload error: ${error}`);
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <NavigationBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h1">Manage Profile</Typography>
        <Card sx={{ mt: 4, p: 3, borderRadius: "30px", background: "#f0f0f0" }}>
          <CardContent>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar sx={{ width: 180, height: 180 }} src={photoURL} />
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
                        backgroundColor: "white",
                        boxShadow: 3,
                        "&:hover": { backgroundColor: "lightgray" },
                      }}
                      
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="First Name"
                      fullWidth
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Contact Number"
                      fullWidth
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Address"
                      fullWidth
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm Password"
                      type="password"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      onClick={handleUpdateProfile}
                      variant="contained"
                      sx={{
                        backgroundColor: "#FFB700", // Set background color to #FFB700
                        "&:hover": {
                          backgroundColor: "#e6a500", // Optional: Add a darker shade for hover effect
                        },
                      }}
                      fullWidth
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default ManageProfile;
