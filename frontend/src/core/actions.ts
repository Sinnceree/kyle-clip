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
		console.log(user)
	}

	console.log("Not logged in")
	core.state.loading.set(false)
}


export const logout = async () => {
	core.state.isAuthenticated.set(false)
	core.state.user.set(null)
	await Firebase.auth().signOut()
}
