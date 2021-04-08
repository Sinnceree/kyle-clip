import firebase from "firebase/app"
import "firebase/auth"

const app = firebase.initializeApp({
	apiKey: "AIzaSyA5PVO7p1qPr_nVrzsuXwFqySVBmSgAxqU",
  authDomain: "vulture-84cb9.firebaseapp.com",
  projectId: "vulture-84cb9",
  storageBucket: "vulture-84cb9.appspot.com",
  messagingSenderId: "738247494836",
  appId: "1:738247494836:web:cdd28678f03fd3f6d05be1"
})

export default app