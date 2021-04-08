import tmi from "tmi.js"
import { io } from "../app"
const { Twitch } = require("node-ttv")
import { ClipObject } from "../typeDefs"

export class BotClient {
  twitchClient: tmi.Client;
  clipsEnabled: boolean;
  queuedClips: string[]
  watchedClips: string[];
  currentClip: null | string;
  queuedClipsData: {
    [key: string]: ClipObject
  };

  constructor(client: tmi.Client) {
    this.clipsEnabled = false;
    this.twitchClient = client;
    this.queuedClips = [];
    this.watchedClips = [];
    this.currentClip = null;
    this.queuedClipsData = {}
  }



  enableClips(channel: string, user: tmi.ChatUserstate) {
    if (user.badges?.broadcaster !== "1") { return }

    if (this.clipsEnabled) {
      return this.twitchClient.say(channel, `@${user.username}, Clip time is already enabled!`);
    }

    this.clipsEnabled = true;
    this.queuedClips = [];
    io.emit("message", { type: "enableClips" });
    this.twitchClient.say(channel, `@${user.username}, Successfully enabled clip time!`);
  }

  disableClips(channel: string, user: tmi.ChatUserstate) {
    if (user.badges?.broadcaster !== "1") { return }

    this.clipsEnabled = false;
    this.queuedClips = [];
    this.watchedClips = [];
    io.emit("message", { type: "disableClips" });
    this.twitchClient.say(channel, `@${user.username}, Successfully disabled clip time!`);
  }

  clipsQueued(channel: string, user: tmi.ChatUserstate) {
    return this.twitchClient.say(channel, `@${user.username}, the queue has ${this.queuedClips.length} Clips!`);
  }

  playClip(clip: string) {
    if (clip !== this.currentClip && this.currentClip !== null) {
      let index = this.queuedClips.findIndex(e => e === this.currentClip);
      delete this.queuedClipsData[this.currentClip]; // Remove this clip data from object
      this.queuedClips.splice(index, 1); // Remove this clip from the queue

      this.currentClip = clip;
      io.emit("message", { type: "newClip", clip: this.queuedClipsData[clip] });
      io.emit("message", { type: "clipQueue", clips: Object.keys(this.queuedClipsData).map(e => this.queuedClipsData[e]) }); // Send new clips to frontend
    }

  }

  playNextClip(clip: string) {
    let index = this.queuedClips.findIndex(e => e === clip);

    delete this.queuedClipsData[clip]; // Remove this clip data from object
    this.watchedClips.push(clip); // Add this clip to already watched clips
    this.queuedClips.splice(index, 1); // Remove this clip from the queue

    if (this.queuedClips.length > 0) {
      if (this.clipsEnabled) {
        this.currentClip = this.queuedClips[0];
        io.emit("message", { type: "newClip", clip: this.queuedClipsData[this.queuedClips[0]] });
      }
    } else {
      console.log("No more clips ")
      io.emit("message", { type: "clipsEmpty" });
    }

    io.emit("message", { type: "clipQueue", clips: Object.keys(this.queuedClipsData).map(e => this.queuedClipsData[e]) }); // Send new clips to frontend

  }


  async handleNewClip(clipUrl: string) {
    // Check is this a twitch clip?
    const isClip = clipUrl.includes("https://clips.twitch.tv/")
    if (!isClip) { return }

    // Check if clip time is enabled
    if (!this.clipsEnabled) { return }


    const urlSplit = clipUrl.split("/");
    const clipSlug = urlSplit[urlSplit.length - 1].split(".")[0];

    // Clip is alrady in queue
    if (this.queuedClips.includes(clipSlug)) { return }

    // Clip was already watched during this clip time session
    if (this.watchedClips.includes(clipSlug)) { return }


    try {
      const clip: { data: ClipObject[] } = await Twitch.clips.getClips({ id: clipSlug })

      if (clip.data.length > 0) {
        this.queuedClipsData[clipSlug] = clip.data[0]
        this.queuedClipsData[clipSlug].video_url = clip.data[0].thumbnail_url.split("-preview-")[0] + ".mp4";

        if (this.queuedClips.length === 0) {
          this.currentClip = clipSlug;
          io.emit("message", { type: "newClip", clip: this.queuedClipsData[clipSlug] });
        }

        io.emit("message", { type: "clipQueue", clips: Object.keys(this.queuedClipsData).map(e => this.queuedClipsData[e]) }); // Send new clips to frontend
        this.queuedClips.push(clipSlug); // Add clip ther queue
        console.log("Added clip to queue");
      }

    } catch (error) {
      console.error(error)
    }

  }
}