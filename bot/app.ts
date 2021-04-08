import tmi from "tmi.js"
import * as dotenv from "dotenv"
import socket from "socket.io"
import { ClipObject } from "./typeDefs"


const { Twitch } = require("node-ttv")

// Init .env
dotenv.config()

// const tmi = require('tmi.js');
const io = socket(process.env.PORT || 5000)

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
  channels: ["Kyle", "Sinncere"]
});
client.connect();

// Twitch.getRefreshToken("ysj93xwdsvfpfjn0mqtdpo1me7rf35", process.env["clientID"], process.env["secret"]);
Twitch.init(process.env["refreshToken"], process.env["clientID"], process.env["secret"])

// Global variables
let clipsEnabled = false;
let queuedClips: string[] = [];
let queuedClipsData: { [key: string]: ClipObject } = {}
let watchedClips: string[] = [];
let currentClip: null | string = null;

client.on("message", (channel, user, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  // lowercase message
  const uncasedMessage = message.trim()
  message = message.toLowerCase().trim();

  switch (message) {
    case "!clips enable":
      return enableClips(channel, user);
    case "!clips disable":
      return disableClips(channel, user);
    case "!clips queue":
      return clipsQueued(channel, user)
    default:
      return handleNewClip(uncasedMessage)
  }
});

function clipsQueued(channel: string, user: tmi.ChatUserstate) {
  return client.say(channel, `@${user.username}, the queue has ${queuedClips.length} Clips!`);
}

function enableClips(channel: string, user: tmi.ChatUserstate) {
  if (user.badges?.broadcaster !== "1") { return }

  if (clipsEnabled) {
    return client.say(channel, `@${user.username}, Clip time is already enabled!`);
  }

  clipsEnabled = true;
  queuedClips = [];
  io.emit("message", { type: "enableClips" });
  client.say(channel, `@${user.username}, Successfully enabled clip time!`);
}

function disableClips(channel: string, user: tmi.ChatUserstate) {
  if (user.badges?.broadcaster !== "1") { return }

  clipsEnabled = false;
  queuedClips = [];
  watchedClips = [];
  io.emit("message", { type: "disableClips" });
  client.say(channel, `@${user.username}, Successfully disabled clip time!`);
}


io.on("connection", (socket) => {

  if (clipsEnabled && queuedClips.length > 0) {
    io.emit("message", { type: "newClip", clip: queuedClipsData[queuedClips[0]] });
    io.emit("message", { type: "clipQueue", clips: Object.keys(queuedClipsData).map(e => queuedClipsData[e]) });
  }

  socket.on("message", (data) => {
    switch (data.type) {
      case "nextClip":
        return playNextClip(data.lastClip);
      case "removeClip":
        return removeClip(data.clip);
      case "playClip":
        return playClip(data.clip);
      default:
        return;
    }
  });
  socket.on("disconnect", () => console.log("user disconnected"));
  socket.on("connect", () => console.log("user connect"));
});

function playNextClip(clip: string) {
  let index = queuedClips.findIndex(e => e === clip);

  delete queuedClipsData[clip]; // Remove this clip data from object
  watchedClips.push(clip); // Add this clip to already watched clips
  queuedClips.splice(index, 1); // Remove this clip from the queue

  if (queuedClips.length > 0) {
    if (clipsEnabled) {
      currentClip = queuedClips[0];
      io.emit("message", { type: "newClip", clip: queuedClipsData[queuedClips[0]] });
    }
  } else {
    console.log("No more clips ")
    io.emit("message", { type: "clipsEmpty" });
  }

  io.emit("message", { type: "clipQueue", clips: Object.keys(queuedClipsData).map(e => queuedClipsData[e]) }); // Send new clips to frontend

}

async function handleNewClip(clipUrl: string) {
  // Check is this a twitch clip?
  const isClip = clipUrl.includes("https://clips.twitch.tv/")
  if (!isClip) { return }

  // Check if clip time is enabled
  if (!clipsEnabled) { return }


  const urlSplit = clipUrl.split("/");
  const clipSlug = urlSplit[urlSplit.length - 1].split(".")[0];

  // Clip is alrady in queue
  if (queuedClips.includes(clipSlug)) { return }

  // Clip was already watched during this clip time session
  if (watchedClips.includes(clipSlug)) { return }


  try {
    const clip: { data: ClipObject[] } = await Twitch.clips.getClips({ id: clipSlug })

    if (clip.data.length > 0) {
      queuedClipsData[clipSlug] = clip.data[0]
      queuedClipsData[clipSlug].video_url = clip.data[0].thumbnail_url.split("-preview-")[0] + ".mp4";

      if (queuedClips.length === 0) {
        currentClip = clipSlug;
        io.emit("message", { type: "newClip", clip: queuedClipsData[clipSlug] });
      }

      io.emit("message", { type: "clipQueue", clips: Object.keys(queuedClipsData).map(e => queuedClipsData[e]) }); // Send new clips to frontend
      queuedClips.push(clipSlug); // Add clip ther queue
      console.log("Added clip to queue");
    }

  } catch (error) {
    console.error(error)
  }

}

function removeClip(clip: string) {
  playNextClip(clip);
}

function playClip(clip: string) {
  if (clip !== currentClip && currentClip !== null) {
    let index = queuedClips.findIndex(e => e === currentClip);
    delete queuedClipsData[currentClip]; // Remove this clip data from object
    queuedClips.splice(index, 1); // Remove this clip from the queue

    currentClip = clip;
    io.emit("message", { type: "newClip", clip: queuedClipsData[clip] });
    io.emit("message", { type: "clipQueue", clips: Object.keys(queuedClipsData).map(e => queuedClipsData[e]) }); // Send new clips to frontend
  }

}