import React, { useState, useEffect, createRef } from "react";
import socketIOClient from "socket.io-client";

import core from "./core"
import firebase from "./Firebase"
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import ReactPlayer from "react-player"
import TwitchClip from "./components/TwitchClip/TwitchClip";

import "./assets/main.css";
import { usePulse } from "pulse-framework";
const socket = socketIOClient("http://localhost:5000/");
// const socket = socketIOClient("https://kyle-twitchbot.herokuapp.com/");

const App = () => {
  // Pulse state
  const isAuthenticated = usePulse(core.state.isAuthenticated)
  const playerVolume = usePulse(core.state.playerVolume)
  const loading = usePulse(core.state.loading)
  const [clipsQueue, setClipsQueue] = useState<object[]>([]);
  const [password, setPassword] = useState<string>("");
  const [currentClip, setCurrentClip] = useState<any>(null);
  const [clipsEnabled, setClipsEnabled] = useState<boolean>(false);
  const playerRef = createRef<any>()

  const removeClip = (clip: string) => socket.emit("message", { type: "removeClip", clip: clip });
  const playClip = (clip: string) => socket.emit("message", { type: "playClip", clip: clip });
  const clipsEmpty = () => setCurrentClip(null);

  const onClipEnded = (clip: any) => {
    if (clip) {
      socket.emit("message", { type: "nextClip", lastClip: clip.id })
    }
  }

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
        case "clipsEmpty":
          return clipsEmpty();
        default:
          return;
      }
    });
    firebase.auth().onAuthStateChanged((user) => core.actions.checkAuthentication(user))
  }, []);

  const [error, setError] = useState<null | string>(null)
  const login = async () => {
    const loggedIn = await core.actions.login(password)
    if (loggedIn.error) {
      setError(loggedIn.message)
    }
  }

  useEffect(() => {
    if (!loading) {
      const video = document.querySelector("video");
      if (video) {
        video.addEventListener("volumechange", (event) => {
          core.state.playerVolume.set(video.volume)
        });
      }
    }
  }, [loading])

  return (
    <Container className="container">

      {!loading && !isAuthenticated ?
        <div className="login">
          <label>Login To View</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
          {error && <p className="error">{error}</p>}
        </div>
        :
        <React.Fragment>
          <div className="row">
            <ReactPlayer
              ref={playerRef}
              className="clip-player" url={currentClip !== null ? currentClip.video_url : ""}
              playing
              controls
              volume={playerVolume}
              onEnded={() => onClipEnded(currentClip)} />
          </div>


          <div className="row clip-section">
            <div className="header-text">Clip Management</div>

            <div className="clips">
              <Grid container spacing={2}>
                {clipsQueue && clipsQueue.map((clip: any) => (
                  <TwitchClip
                    removeClip={() => removeClip(clip.id)}
                    playClip={() => playClip(clip.id)}
                    slug={clip.id}
                    thumbnail={clip.thumbnail_url}
                    title={clip.title} />
                ))}

              </Grid>
            </div>
          </div>
        </React.Fragment>
      }
    </Container>
  )
}

export default App;
