import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
 
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Avatar,
  IconButton,
  Box,
  Paper,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigationBar from "../components/NavigationBar";

const ChatBox: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: string; timestamp: any }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as any)
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send New Message
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      sender: user?.displayName || "Anonymous",
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  // Delete Message
  const confirmDeleteMessage = (id: string) => {
    setSelectedMessageId(id);
    setConfirmDeleteOpen(true);
  };

  const deleteMessage = async () => {
    if (selectedMessageId) {
      await deleteDoc(doc(db, "messages", selectedMessageId));
      setConfirmDeleteOpen(false);
      setSelectedMessageId(null);
    }
  };

  // Start Editing Message
  const startEditing = (id: string, text: string) => {
    setEditingMessageId(id);
    setEditedMessage(text);
    setAnchorEl(null);
  };

  // Save Edited Message
  const saveEditedMessage = async (id: string) => {
    await updateDoc(doc(db, "messages", id), {
      text: editedMessage,
    });
    setEditingMessageId(null);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessageId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessageId(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <NavigationBar />
      <Grid container spacing={1} >
        <Grid item xs={3}>
          <Box sx={{ background: "#FFD700", padding: 2, borderRadius: 2 , minWidth: 200 }}>
            <Typography variant="h6">Chat History</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar />
                <span>John Doe</span>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar />
                <span>Kumar Singh</span>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={9}>
      <Typography variant="h4" sx={{ textAlign: "left", mb: 3 }}>
        Chat Box
      </Typography>
      <Card
        sx={{
          p: 3,
          borderRadius: "20px",
          background: "#f9f9f9",
          boxShadow: 3,
        }}
      >
        <CardContent>
          <List
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              background: "#fff",
              p: 2,
              borderRadius: "10px",
              boxShadow: 2,
            }}
          >
            {messages.map((msg) => (
              <ListItem
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === user?.displayName
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                {msg.sender !== user?.displayName && (
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                    {msg.sender.charAt(0)}
                  </Avatar>
                )}
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    maxWidth: "75%",
                    backgroundColor:
                      msg.sender === user?.displayName ? "#1976d2" : "#e0e0e0",
                    color: msg.sender === user?.displayName ? "white" : "black",
                    position: "relative",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {msg.sender}
                  </Typography>

                  {editingMessageId === msg.id ? (
                    <>
                      <TextField
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ backgroundColor: "white", borderRadius: "8px" }}
                      />
                      <Box sx={{ display: "flex", mt: 1 }}>
                        <IconButton
                          onClick={() => saveEditedMessage(msg.id)}
                          color="success"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setEditingMessageId(null)}
                          color="error"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2">{msg.text}</Typography>
                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.75rem",
                      opacity: 0.7,
                      textAlign: "right",
                      display: "block",
                      mt: 0.5,
                    }}
                  >
                    {msg.timestamp?.toDate
                      ? new Date(msg.timestamp.toDate()).toLocaleTimeString()
                      : "Sending..."}
                  </Typography>

                  {/* Three-Dot Menu */}
                  {msg.sender === user?.displayName && (
                    <Box sx={{ position: "absolute", top: 4, right: 4 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, msg.id)}
                      >
                        <MoreVertIcon sx={{ color: "white" }} />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={selectedMessageId === msg.id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => startEditing(msg.id, msg.text)}
                        >
                          <EditIcon sx={{ mr: 1 }} /> Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => confirmDeleteMessage(msg.id)}
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon sx={{ mr: 1 }} /> Delete
                        </MenuItem>
                      </Menu>
                    </Box>
                  )}
                </Paper>
              </ListItem>
            ))}
            <div ref={chatEndRef} />
          </List>

          {/* Message Input Field */}
          <Box sx={{ display: "flex", mt: 2 }}>
            <TextField
              label="Type a message..."
              fullWidth
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              sx={{
                background: "white",
                borderRadius: "8px",
              }}
            />
            <Button
              onClick={sendMessage}
              variant="contained"
              sx={{
                ml: 2,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#165a9b" },
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </CardContent>
      </Card>
      </Grid>
      </Grid>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Delete Message?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this message?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={deleteMessage} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default ChatBox;
