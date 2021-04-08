import { App } from "./pulse"

export const isAuthenticated = App.State<boolean>(false)
export const loading = App.State<boolean>(true)
export const user = App.State<any>(null)
export const playerVolume = App.State<number>(0.1).persist("player_volume")
export const autoPlayClip = App.State<boolean>(true).persist("auto_play_clip")