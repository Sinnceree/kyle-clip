import firebase from "firebase"
import core from "."
import Firebase from "../Firebase"

export const login = async (password: string) => {
	// If we make it here we have a email to use on login
	try {
		await Firebase.auth().signInWithEmailAndPassword("kyle@clips.com", password)
		return { error: false, message: null }
	} catch (error) {
		return { error: true, message: error.message }
	}

}

export const checkAuthentication = async (user: firebase.User | null) => {

	if (user) {
		core.state.isAuthenticated.set(true)
		core.state.user.set(user)

		const token = await firebase.auth().currentUser?.getIdToken(true);
		core.state.token.set(token)
		core.API.config.options.headers = {
			"token": token!,
			"uid": user.uid
		}
	}
	core.state.loading.set(false)
}

export const toggleClipMode = async (toggle: boolean) => {
	await core.routes.toggleClips(toggle);
}

export const playClip = async (clipId: string) => {
	await core.routes.playClip(clipId);;
}

export const removeClip = async (clipId: string) => {
	await core.routes.removeClip(clipId);;
}

export const nextClip = async (clipId: string) => {
	await core.routes.nextClip(clipId);;
}

export const logout = async () => {
	core.state.isAuthenticated.set(false)
	core.state.user.set(null)
	await Firebase.auth().signOut()
}
