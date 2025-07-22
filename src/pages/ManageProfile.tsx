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
  // Typography,
  Avatar,
  Alert,
  Container,
  Grid,
  ThemeProvider,
  createTheme,
  IconButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import NavigationBar from "../components/NavigationBar";

const theme = createTheme({
  palette: {
    primary: { main: "#FFB700" }, // Purple for sidebar and buttons
    secondary: { main: "#FFB700" },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h6: {
      fontWeight: 600,
      fontSize: "1.5rem",
      textAlign: "center",
    },
  },
});

const ManageProfile = () => {
  const auth = getAuth();
  const storage = getStorage();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.displayName?.split(" ")[0] || "");
  const [newFirstName, setNewFirstName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      await updateProfile(user, { displayName: `${firstName} ${newFirstName}` });
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
          setPhotoURL(downloadURL);
          setMessage("Profile picture updated successfully!");
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
      <Container sx={{ flexGrow: 1, py: 4 }}>
        

        <Box
          sx={{
            maxWidth: "600px",
            margin: "0 auto",
            p: 3,
            backgroundColor: "white",
            borderRadius: "20px",
            boxShadow: 1,
          }}
        >
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar sx={{ width: 100, height: 100, mx: "auto" }} src={photoURL} />
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
                  position: "relative",
                  top: "-20px",
                  left: "40px",
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "lightgray" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </label>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="First Name" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="First Name" fullWidth value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email Address" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Phone Number" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Country" fullWidth value={country} onChange={(e) => setCountry(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="City" fullWidth value={city} onChange={(e) => setCity(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Address" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Zip Code" fullWidth value={""} onChange={(e) => setAddress(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
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
                variant="contained"
                color="secondary"
                onClick={handleUpdateProfile}
                fullWidth
                sx={{ borderRadius: "20px", mt: 2 }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ManageProfile;