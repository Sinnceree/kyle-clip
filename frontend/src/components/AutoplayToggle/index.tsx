import React from "react"
import { usePulse } from "pulse-framework";
import core from "../../core"

const AutoplayToggle = () => {
  const autoPlayClip = usePulse(core.state.autoPlayClip)
  return (
    <div className="autoplay">
      <p>Autoplay</p>
      <label className="switch">
        <input type="checkbox" onChange={(e) => core.state.autoPlayClip.set(e.target.checked)} checked={autoPlayClip} />
        <span className="slider"></span>
      </label>
    </div>
  )
}

export default AutoplayToggle