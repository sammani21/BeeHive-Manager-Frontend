import * as React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import { MailOutline, AccessTime } from "@mui/icons-material";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";

const Recommendation: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [beekeepers, setBeekeepers] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hives, setHives] = React.useState<any[]>([]);
  const [selectedBeekeeper, setSelectedBeekeeper] = React.useState("");
  const [selectedHive, setSelectedHive] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const selectedBeekeeperObj = beekeepers.find((b) => b._id === selectedBeekeeper);
  const selectedHiveObj = hives.find((h) => h._id === selectedHive);

  React.useEffect(() => {
    fetchBeekeepers();
  }, []);

  const fetchBeekeepers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/beekeeper");
      setBeekeepers(res.data.data);
    } catch (error) {
      console.error("Error fetching beekeepers", error);
    }
  };

  const fetchHivesByBeekeeper = async (beekeeperId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/hive/byBeekeeper/${beekeeperId}`
      );
      setHives(res.data.data);
    } catch (error) {
      console.error("Error fetching hives", error);
      setHives([]);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBeekeeperChange = (event: any) => {
    const id = event.target.value;
    setSelectedBeekeeper(id);
    setSelectedHive("");
    if (id) {
      fetchHivesByBeekeeper(id);
    } else {
      setHives([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedBeekeeper || !selectedHive || !category || !message) {
      setErrorMessage("Please fill all fields");
      setSuccessMessage("");
      return;
    }

    try {
      const payload = {
        beekeeperId: selectedBeekeeper,
        hiveId: selectedHive,
        category,
        message,
      };

      await axios.post("http://localhost:3000/api/v1/recommendation", payload);
      setSuccessMessage("Recommendation sent successfully.");
      setErrorMessage("");
      setSelectedBeekeeper("");
      setSelectedHive("");
      setCategory("");
      setMessage("");
      setHives([]);
    } catch (error) {
      console.error("Error sending recommendation", error);
      setErrorMessage("Failed to send recommendation.");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <NavigationBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Left Side - Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" mb={3}>
              Generate Recommendation
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Box display="flex" flexDirection="column" gap={3}>
              <FormControl fullWidth>
                <InputLabel>Select Beekeeper</InputLabel>
                <Select
                  value={selectedBeekeeper}
                  onChange={handleBeekeeperChange}
                  label="Select Beekeeper"
                >
                  {beekeepers.map((keeper) => (
                    <MenuItem key={keeper._id} value={keeper._id}>
                      {keeper.name} ({keeper.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={!selectedBeekeeper}>
                <InputLabel>Select Hive</InputLabel>
                <Select
                  value={selectedHive}
                  onChange={(e) => setSelectedHive(e.target.value)}
                  label="Select Hive"
                >
                  {hives.map((hive) => (
                    <MenuItem key={hive._id} value={hive._id}>
                      {hive.hiveId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Harvest">Harvest</MenuItem>
                  <MenuItem value="Inspection">Inspection</MenuItem>
                  <MenuItem value="Alert">Alert</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Recommendation Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button
                variant="contained"
                sx={{
                  minWidth: "50px",
                  padding: "10px",
                  backgroundColor: "#FFB700",
                }}
                onClick={handleSubmit}
              >
                Send Recommendation
              </Button>
            </Box>
          </Grid>

          {/* Right Side - Live Preview */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Live Preview
            </Typography>

            <Card
              elevation={4}
              sx={{ borderRadius: 3, backgroundColor: "#fdfdfd" }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: "#FFB700" }}>
                      <MailOutline />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Recommendation Notice
                    </Typography>
                  </Box>
                  <Chip
                    icon={<AccessTime />}
                    label={new Date().toLocaleString()}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  color="text.secondary"
                >
                  To:
                </Typography>
                <Typography variant="body1" mb={1}>
                  {selectedBeekeeperObj
                    ? `${selectedBeekeeperObj.name} (${selectedBeekeeperObj.email})`
                    : "Not selected"}
                </Typography>

                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Hive ID:
                </Typography>
                <Typography variant="body1" mb={1}>
                  {selectedHiveObj ? selectedHiveObj.hiveId : "Not selected"}
                </Typography>

                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Category:
                </Typography>
                <Chip
                  label={category || "Not selected"}
                  color={category ? "primary" : "default"}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Message:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-line",
                    p: 2,
                    backgroundColor: "#fafafa",
                    borderRadius: 2,
                    border: "1px dashed #ccc",
                  }}
                >
                  {message || "No message yet"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Recommendation;