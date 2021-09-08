// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzy685cKmdP84s2U5ZEORs0XfLYIVXXNU",
  authDomain: "shrestha-app.firebaseapp.com",
  projectId: "shrestha-app",
  storageBucket: "shrestha-app.appspot.com",
  messagingSenderId: "1068081297258",
  appId: "1:1068081297258:web:51073d4fbdfafc8ec05713",
  measurementId: "G-7LKWWTE3JY",
};


// Initializing firebase with config
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Creating dbsetup
const db = firebaseApp.firestore();

// Authenticating
const auth = firebase.auth();

// telling firebase to use fb id to login
const facebookProvider = new firebase.auth.FacebookAuthProvider();
facebookProvider.addScope("user_birthday");

export { auth, facebookProvider };
export default db;
