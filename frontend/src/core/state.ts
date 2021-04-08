import { App } from "./pulse"

export const isAuthenticated = App.State<boolean>(false)
export const loading = App.State<boolean>(true)
export const user = App.State<any>(null)