const tmi = require('tmi.js');
const io = require('socket.io')(5000);
const request = require('request');

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: "KyleClipBot",
    password: "_"
  },
  channels: ["Sinncere"]
});

client.connect();

// Global variables
let enableClips = false;
let queuedClips = [];
let queuedClipsData = {}
let watchedClips = [];
let currentClip = null;

client.on("message", (channel, user, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  // lowercase message
  let uncasedMessage = message
  message = message.toLowerCase();

  if (message === "!clips enable") {

    if (enableClips) {
      return client.say(channel, `@${user.username}, Clip time is already enabled!`);
    }
    enableClips = true;
    queuedClips = [];
    io.emit("message", { type: "enableClips" });
    client.say(channel, `@${user.username}, Successfully enabled clip time!`);
  }

  if (message === "!clips disable") {
    enableClips = false;
    queuedClips = [];
    watchedClips = [];
    io.emit("message", { type: "disableClips" });
    client.say(channel, `@${user.username}, Successfully disabled clip time!`);
  }

  if (message === "!clips queue") {
    client.say(channel, `@${user.username}, the queue has ${queuedClips.length} Clips!`);
  }

  if (message.includes("https://clips.twitch.tv/") && enableClips) {
    addClipQueue(uncasedMessage.replace("https://clips.twitch.tv/", ""));
  }
});


io.on("connection", (socket) => {

  if (enableClips && queuedClips.length > 0) {
    io.emit("message", { type: "newClip", clip: queuedClipsData[queuedClips[0]] });
    io.emit("message", { type: "clipQueue", clips: Object.keys(queuedClipsData).map(e => queuedClipsData[e]) });
  }

  socket.on("message", (data) => {
    switch (data.type) {
      case "nextClip":
        return playNextClip(data.lastClip.toLowerCase());
      case "removeClip":
        return removeClip(data.clip.toLowerCase());
      case "playClip":
        return playClip(data.clip.toLowerCase());
      default:
        return;
    }
  });
  socket.on("disconnect", () => console.log("user disconnected"));
});

function playNextClip(clip) {
  let index = queuedClips.findIndex(e => e === clip);

  delete queuedClipsData[clip]; // Remove this clip data from object
  watchedClips.push(clip); // Add this clip to already watched clips
  queuedClips.splice(index, 1); // Remove this clip from the queue

  if (queuedClips.length > 0) {
    if (enableClips) {
      currentClip = queuedClips[0];
      io.emit("message", { type: "newClip", clip: queuedClipsData[queuedClips[0]] });
    }
  } else {
    io.emit("message", { type: "disableClips" });
  }

  io.emit("message", { type: "clipQueue", clips: Object.keys(queuedClipsData).map(e => queuedClipsData[e]) }); // Send new clips to frontend

}

async function addClipQueue(clip) {
  if (queuedClips.includes(clip)) return console.log("Not adding clip it is already in queue");
  if (watchedClips.includes(clip)) return console.log("Not adding clip it is already watched");

  try {
    const ClipData = await getClip(clip);
    queuedClipsData[clip] = ClipData;

    queuedClipsData[clip].video_url = ClipData.thumbnails.small.split("-preview-")[0] + ".mp4";

    if (queuedClips.length === 0) {
      currentClip = clip;
      io.emit("message", { type: "newClip", clip: queuedClipsData[clip] });
    }

    io.emit("message", { type: "clipQueue", clips: Object.keys(queuedClipsData).map(e => queuedClipsData[e]) }); // Send new clips to frontend
    queuedClips.push(clip); // Add clip ther queue
    console.log("Added clip to queue");
  } catch (error) {
    console.log(error);
  }

}

function removeClip(clip) {
  playNextClip(clip);
}

function playClip(clip) {
  if (clip !== currentClip) {
    let index = queuedClips.findIndex(e => e === currentClip);
    delete queuedClipsData[currentClip]; // Remove this clip data from object
    queuedClips.splice(index, 1); // Remove this clip from the queue

    currentClip = clip;
    io.emit("message", { type: "newClip", clip: queuedClipsData[clip] });
    io.emit("message", { type: "clipQueue", clips: Object.keys(queuedClipsData).map(e => queuedClipsData[e]) }); // Send new clips to frontend
  }

}

async function getClip(slug) {
  var options = {
    url: `https://api.twitch.tv/kraken/clips/${slug}`,
    method: "GET",
    headers: {
      "Client-ID": "_",
      "Accept": "application/vnd.twitchtv.v5+json",
    }
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (response && response.statusCode == 200) {
        resolve(JSON.parse(body))
      } else {
        reject(JSON.parse(body));
      }
    });
  })
}