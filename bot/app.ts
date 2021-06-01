import tmi from "tmi.js"
import * as dotenv from "dotenv"
import socket from "socket.io"
import { BotClient } from "./classes/BotClient"
import request from "request"
import logger from "morgan"
import { Twitch } from "node-ttv"
import http from "http"
import bodyParser from "body-parser"
import cors from "cors"
import express, { Router } from "express"
import { authenticate } from "./middlewares/authenticate";

dotenv.config()

// Init express
const app = express()
const server = http.createServer(app);

server.listen(process.env.PORT || 5000, () => console.log("Started running rest api"))
export const io = socket(server)

// Express middlewares
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors)
const router = Router()
app.use("/v1", authenticate, router)

// Lets connect to the twitch irc
const client = new tmi.Client({
  options: { debug: false },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: process.env["botUsername"],
    password: process.env["botPassword"]
  },
  channels: ["Kyle"]
});
client.connect();

Twitch.init(process.env["refreshToken"], process.env["clientID"], process.env["secret"])

// Lets create the client
const bot = new BotClient(client);


client.on("message", (channel, user, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  // lowercase message
  const uncasedMessage = message.trim()
  message = message.toLowerCase().trim();

  switch (message) {
    case "!clips enable":
      return bot.enableClips(channel, user);
    case "!clips disable":
      return bot.disableClips(channel, user);
    case "!clips queue":
      return bot.clipsQueued(channel, user)
    default:
      return bot.handleNewClip(uncasedMessage)
  }
});





io.on("connection", (socket) => {

  if (bot.clipsEnabled && bot.queuedClips.length > 0) {
    io.emit("message", { type: "newClip", clip: bot.queuedClipsData[bot.queuedClips[0]] });
    io.emit("message", { type: "clipQueue", clips: Object.keys(bot.queuedClipsData).map(e => bot.queuedClipsData[e]) });
  }

  io.emit("message", { type: "clipsEnabledStaus", status: bot.clipsEnabled });

  socket.on("disconnect", () => console.log("user disconnected"));
  socket.on("connect", () => console.log("user connect"));
});



router.post("/toggleClips", (req, res) => {
  const { toggle } = req.body;

  if (toggle) {
    bot.enableClips()
  } else {
    bot.disableClips()
  }

  res.json({ success: true })
});

router.post("/playClip", (req, res) => {
  const { clipId } = req.body;
  bot.playClip(clipId);
  res.json({ success: true })
});

router.post("/removeClip", (req, res) => {
  const { clipId } = req.body;
  bot.playNextClip(clipId);
  res.json({ success: true })
});

router.post("/nextClip", (req, res) => {
  const { clipId } = req.body;
  bot.playNextClip(clipId);
  res.json({ success: true })
});












setInterval(() => {
  request("https://kyle-twitchbot.herokuapp.com/", (error, response, body) => {
    if (error) {
      console.log(error)
    }
    console.log("Pinged Heroku so we don't idle out.")
  })
}, 600000) // Ping every 10 minutes