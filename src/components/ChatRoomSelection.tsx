import React from "react";
import NavigationBar from "../components/NavigationBar";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

interface ChatRoomSelectionProps {
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  setIsInChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatRoomSelection: React.FC<ChatRoomSelectionProps> = ({ room, setRoom, setIsInChat }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#ffffff" }}>
      <NavigationBar />

      {/* Chat Header */}
      <Paper elevation={3} sx={{ padding: 2, textAlign: "center", backgroundColor: "#FFB700", color: "#fff" }}>
        <Typography variant="h6">Join a Chat With a Bee Keeper</Typography>
      </Paper>

      {/* Room Input Container */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
            borderRadius: "12px",
          }}
        >
          <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            Enter the Bee Keeper ID to start chatting:
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Bee Keeper ID..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFB700",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#E0A500" },
            }}
            onClick={() => {
              if (room.trim() !== "") setIsInChat(true);
            }}
          >
            Enter Chat
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatRoomSelection;
