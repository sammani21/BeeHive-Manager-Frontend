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
} from "@mui/material";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";

const Recommendation: React.FC = () => {
  const [beekeepers, setBeekeepers] = React.useState<any[]>([]);
  const [hives, setHives] = React.useState<any[]>([]);
  const [selectedBeekeeper, setSelectedBeekeeper] = React.useState("");
  const [selectedHive, setSelectedHive] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

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
    }
  };

  const handleBeekeeperChange = (event: any) => {
    const id = event.target.value;
    setSelectedBeekeeper(id);
    setSelectedHive("");
    fetchHivesByBeekeeper(id);
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

      const response = await axios.post("http://localhost:3000/api/v1/recommendation", payload);
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <NavigationBar />
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Generate Recommendation
      </Typography>

      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Box display="flex" flexDirection="column" gap={3}>
        <FormControl fullWidth>
          <InputLabel>Select Beekeeper</InputLabel>
          <Select value={selectedBeekeeper} onChange={handleBeekeeperChange} label="Select Beekeeper">
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
          <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
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

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Send Recommendation
        </Button>
      </Box>
    </Container>
  );
};

export default Recommendation;
