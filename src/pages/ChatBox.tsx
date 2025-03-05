import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import NavigationBar from "../components/NavigationBar";

import "../styles/Chat.css";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import SendIcon from "@mui/icons-material/Send";

// Define the props type
interface ChatProps {
  room: string;
}

// Define the shape of a message
interface Message {
  id: string;
  text: string;
  createdAt: Date | null;
  user: string;
  room: string;
}

export const ChatBox: React.FC<ChatProps> = ({ room }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages: Message[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt?.toDate() ?? null,
        user: doc.data().user,
        room: doc.data().room,
      }));

      setMessages(messages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [room]); // Add 'room' to dependency array to avoid stale closures

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newMessage.trim() === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser?.displayName || "Anonymous",
      room,
    });

    setNewMessage("");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#ffffff" }}>
      <NavigationBar />
      
      {/* Chat Header */}
      <Paper elevation={3} sx={{ padding: 2, textAlign: "left", backgroundColor: "#FFB700", color: "#fff" }}>
        <Typography variant="h6">Welcome to: {room.toUpperCase()}</Typography>
      </Paper>

      {/* Messages Container */}
      <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              flexDirection: message.user === auth.currentUser?.displayName ? "row-reverse" : "row",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Paper
              sx={{
                padding: "10px",
                backgroundColor: message.user === auth.currentUser?.displayName ? "#FFB700" : "#E3F2FD",
                color: message.user === auth.currentUser?.displayName ? "#fff" : "#000",
                borderRadius: "15px",
                maxWidth: "60%",
                textAlign: "left",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {message.user}
              </Typography>
              <Typography variant="body2">{message.text}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {message.createdAt ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }) : "Just now"}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Field */}
      <Paper
        sx={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          position: "sticky",
          bottom: 0,
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleChange}
          sx={{ marginRight: 1 }}
        />
        <Button
  variant="contained"
  color="primary"
  onClick={handleSubmit as any}
  sx={{ minWidth: "50px", padding: "10px" ,backgroundColor: "#FFB700" }}
>
  <SendIcon />
</Button>
      </Paper>
    </Box>
  );
};

export default ChatBox;