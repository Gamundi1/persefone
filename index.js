import express from "express";
import { Server } from "socket.io";
import http from "http";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
const io = new Server(server);

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
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
