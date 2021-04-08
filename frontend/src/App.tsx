import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import ReactPlayer from "react-player"
import TwitchClip from "./components/TwitchClip/TwitchClip";

import "./assets/main.css";
const socket = socketIOClient("https://kyle-twitchbot.herokuapp.com/");

const App = () => {
  const [clipsQueue, setClipsQueue] = useState<object[]>([]);
  const [currentClip, setCurrentClip] = useState<any>(null);
  const [clipsEnabled, setClipsEnabled] = useState<boolean>(false);

  const removeClip = (clip: string) => socket.emit("message", { type: "removeClip", clip: clip });;
  const playClip = (clip: string) => socket.emit("message", { type: "playClip", clip: clip });;
  const onClipEnded = (clip: any) => socket.emit("message", { type: "nextClip", lastClip: clip.slug });

  const enableClips = () => setClipsEnabled(true);
  const disableClips = () => setClipsEnabled(false);

  const clipQueue = (data: object[]) => setClipsQueue(data);

  const newClip = (clip: any) => {
    if (clip) {
      if (!clipsEnabled) setClipsEnabled(true);

      if (clip.status === 404) {
        return socket.emit("message", { type: "nextClip", lastClip: clip });
      }

      setCurrentClip(clip);
      console.log(clip);
    }
  }

  useEffect(() => {
    socket.on("message", (data: any) => {
      console.log(data)
      switch (data.type) {
        case "enableClips":
          return enableClips();
        case "disableClips":
          return disableClips();
        case "newClip":
          return newClip(data.clip);
        case "clipQueue":
          return clipQueue(data.clips);
        default:
          return;
      }
    });
  }, []);

  return (
    <Container className="container">
      <div className="row">
        <ReactPlayer
          className="clip-player" url={currentClip !== null ? currentClip.video_url : ""}
          // playing
          controls
          onEnded={() => onClipEnded(currentClip)}
          volume={0.1} />
      </div>

      <div className="row clip-section">
        <div className="header-text">Clip Management</div>
        <div className="clips">
          <Grid container spacing={2}>
            {clipsQueue && clipsQueue.map((clip: any) => (
              <TwitchClip
                removeClip={(slug: string) => removeClip(slug)}
                playClip={(slug: string) => playClip(slug)}
                slug={clip.slug}
                thumbnail={clip.thumbnail_url}
                title={clip.title} />
            ))}

          </Grid>
        </div>
      </div>
    </Container>
  )
}

export default App;
