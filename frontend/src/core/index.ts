import { App } from "./pulse"
import * as state from "./state"
import * as routes from "./routes"
import * as actions from "./actions"

export const API = App.API({
	baseURL: "/v1",
	options: {},
})

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	state: { ...state },
	actions: { ...actions },
	routes: { ...routes },
	API,
}