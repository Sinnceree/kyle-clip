import tmi from "tmi.js"
import * as dotenv from "dotenv"
import socket from "socket.io"
import { BotClient } from "./classes/BotClient"


const { Twitch } = require("node-ttv")

// Init .env
dotenv.config()

// const tmi = require('tmi.js');
export const io = socket(process.env.PORT || 5000)

// Lets connect to the twitch irc
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: process.env["botUsername"],
    password: process.env["botPassword"]
  },
  channels: ["Sinncere"]
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


  socket.on("message", (data) => {
    switch (data.type) {
      case "nextClip":
        return bot.playNextClip(data.lastClip);
      case "removeClip":
        return bot.playNextClip(data.clip);
      case "playClip":
        return bot.playClip(data.clip);
      case "requestDisableClips":
        return bot.disableClips()
      case "requestEnableClips":
        return bot.enableClips()
      default:
        return;
    }
  });
  socket.on("disconnect", () => console.log("user disconnected"));
  socket.on("connect", () => console.log("user connect"));
});