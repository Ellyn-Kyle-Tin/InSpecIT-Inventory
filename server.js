import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

console.log("🚀 Starting IoT Notification Server...");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Endpoint for ESP8266
app.post("/detect", (req, res) => {
  const { message, distance_cm } = req.body;
  console.log("📡 Alert from ESP8266:", message, distance_cm);

  io.emit("ultrasonicAlert", {
    message,
    distance_cm,
    timestamp: new Date(),
  });

  res.status(200).json({ status: "ok" });
});

io.on("connection", (socket) => {
  console.log("🧑‍💻 Dashboard connected:", socket.id);
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
