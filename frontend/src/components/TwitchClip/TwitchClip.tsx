import React from "react";
import Grid from "@material-ui/core/Grid";

interface TwitchClipInterface {
  playClip: () => void;
  removeClip: () => void;
  thumbnail: string;
  slug: string;
  title: string;
}


const TwitchClip = (props: TwitchClipInterface) => {
  return (
    <Grid item xs={2}>
      <div className="clip-box">
        <div className="clip-img">
          <div className="clip-hover">
            <button onClick={props.playClip}>Play</button>
            <button onClick={props.removeClip}>Remove</button>
          </div>
          <img src={props.thumbnail} alt="thumb" />
        </div>
        <div className="title">{props.title}</div>
      </div>
    </Grid>
  )
}

export default TwitchClip;