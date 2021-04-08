import React, { useState, useEffect, createRef } from "react";
import socketIOClient from "socket.io-client";
import core from "./core"
import firebase from "./Firebase"
import ReactPlayer from "react-player"
import TwitchClip from "./components/TwitchClip/TwitchClip";
import { usePulse } from "pulse-framework";
import "./assets/main.scss";
import AutoplayToggle from "./components/AutoplayToggle";


// const socket = socketIOClient("http://localhost:5000/");
// const socket = socketIOClient("ec2-3-94-125-219.compute-1.amazonaws.com:5000");
const socket = socketIOClient("https://kyle-twitchbot.herokuapp.com");

const App = () => {
  // Pulse state
  const isAuthenticated = usePulse(core.state.isAuthenticated)
  const autoPlayClip = usePulse(core.state.autoPlayClip)
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
        case "clipsEnabledStaus":
          return setClipsEnabled(data.status)
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
  }, [loading, currentClip])

  return (
    <div className="container">
      {!loading && !isAuthenticated ?
        <div className="login">
          <label>Login To View</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
          {error && <p className="error">{error}</p>}
        </div>
        :
        <React.Fragment>
          <div className="main">
            <ReactPlayer
              ref={playerRef}
              className="clip-player" url={currentClip !== null ? currentClip.video_url : ""}
              playing={autoPlayClip}
              controls
              volume={playerVolume}
              onEnded={() => onClipEnded(currentClip)} />

            <div className="clip-info">
              <h1 className="clip-title">{currentClip && currentClip.title} </h1>
            </div>

          </div>

          <div className="right-block">
            {clipsEnabled ?
              <button className="btn red" onClick={() => socket.emit("message", { type: "requestDisableClips" })}>Disable Clips</button>
              :
              <button className="btn" onClick={() => socket.emit("message", { type: "requestEnableClips" })}>Enable Clips</button>
            }

            <AutoplayToggle />

            <h1 className="queued">Queued Clips ({clipsQueue.length})</h1>
            <div className="clips-list">
              {clipsQueue && clipsQueue.map((clip: any) => (
                <TwitchClip
                  removeClip={() => removeClip(clip.id)}
                  playClip={() => playClip(clip.id)}
                  slug={clip.id}
                  thumbnail={clip.thumbnail_url}
                  title={clip.title} />
              ))}
            </div>

          </div>

          {/* <div className="row controls">
            <h1 className="title">Controls</h1>
            <div className="buttons">
              <button className="control-btn">Enable Clips</button>
              <button className="control-btn">Enable Clips</button>
              <input type="range" />
            </div>
          </div> */}


          {/* <div className="row clip-section">
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
          </div> */}
        </React.Fragment>
      }

    </div>
  )
}

export default App;
