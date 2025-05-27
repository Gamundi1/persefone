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
const openai = new OpenAI();
let votes = [
  [0, 0],
  [0, 0],
  [0, 0]
];
const videosDuration = [166, 210, 210];
let videoStartTime = Date.now();
let roomCapacity = 0;

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

app.get("/video", (req, res) => {
  const { videoId } = req.query;
  if (!videoId) {
    return res.status(421).send("Video ID is required");
  }
  const now = Date.now();
  const videoCurrentTime =
    Math.floor((now - videoStartTime) / 1000) % videosDuration[videoId];
  return res.status(200).json({ videoCurrentTime });
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
    socket.emit("initial-values", votes[0]);
  }, 1000);

  socket.on("user-vote", (team, video) => {
    votes[video][team]++;
    io.emit("update-votes", votes[video]);
  });

  socket.on("create-room", async (event) => {
    rooms.add(event.roomId);
    socket.join(event.roomId);
  });

  socket.on("join-room", async (event) => {
    if (rooms.has(event.roomId)) {
      socket.join(event.roomId);
      roomCapacity = await io.in(event.roomId).fetchSockets();
      if (roomCapacity.length === 2) {
        io.to(event.roomId).emit("complete-connection", event.roomId);
      }
    }
  });

  socket.on("change-video", (data) => {
    if (data.roomId) {
      io.to(data.roomId).emit("update-video", data.videoData, votes[data.videoData.id - 1]);
    } else {
      socket.emit("update-video", data.videoData, votes[data.videoData.id - 1]);
    }
  });

  socket.on("send-event", async (event) => {
    io.to(event.roomId).emit("receive-event", event.event);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
