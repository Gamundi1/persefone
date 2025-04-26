import express from "express";
import { Server } from "socket.io";
import http from "http";
import OpenAI from "openai";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";
import { zodTextFormat } from "openai/helpers/zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Player = z.object({
  nombre: z.string(),
  edad: z.number(),
  descripcion: z.string(),
  posicion: z.string(),
  altura: z.string(),
});

const app = express();
const port = 80;
const server = http.createServer(app);
let votes = [0, 0];
const openai = new OpenAI();

const rooms = new Set();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/main.html"));
});

app.get("/mobile", (req, res) => {
  res.sendFile(path.join(__dirname, "public/mobile.html"));
});

app.get("/desktop", (req, res) => {
  res.sendFile(path.join(__dirname, "public/desktop.html"));
});

app.get("/create-room", (_, res) => {
  const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  rooms.add(roomId);
  res.status(200).json({ roomId });
});

app.post("/join-room", (req, res) => {
  const { roomId } = req.body;
  if (!roomId) {
    return res.status(421).send("Room ID is required");
  }
  if (!rooms.has(roomId)) {
    return res.status(404).send("Room not found");
  }
  return res.status(200).json({ roomId });
});

app.post("/player-info", async (req, res) => {
  const { playerNumber, team } = req.body;

  if (!playerNumber || !team) {
    return res.status(421).send("Missing player number or team");
  }

  try {
    const playerInfo = await openai.responses.parse({
      model: "gpt-4o-mini-2024-07-18",
      input: [
        { role: "system", content: "Extract the event information." },
        {
          role: "user",
          content: `Generate information about the player number ${playerNumber} when he was in team ${team}.`,
        },
      ],
      text: {
        format: zodTextFormat(Player, "event"),
      },
    });
    return res.status(200).send(playerInfo.output_parsed);
  } catch (error) {
    console.error("Error generating player info:", error);
    return res.status(500).send("The player info could not be generated");
  }
});

io.on("connection", (socket) => {
  setTimeout(() => {
    socket.emit("initial-values", votes);
  }, 1000);
  socket.on("user-vote", (team) => {
    votes[team]++;
    io.emit("update-votes", votes);
  });

  socket.on("join-room", (event) => {
    socket.join(event.roomId);
  });

  socket.on("send-event", async (event) => {
    io.to(event.roomId).emit("receive-event", event.event);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
