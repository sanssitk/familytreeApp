// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "shrestha-app.firebaseapp.com",
  projectId: "shrestha-app",
  databaseURL:
    "https://shrestha-app-default-rtdb.asia-southeast1.firebasedatabase.app/",
  storageBucket: "shrestha-app.appspot.com",
  messagingSenderId: "1068081297258",
  appId: process.env.REACT_APP_APIID,
  measurementId: "G-7LKWWTE3JY",
};

// Initializing firebase with config
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Creating dbsetup
const db = firebaseApp.database();
const storage = firebaseApp.firestore();

// Authenticating
const auth = firebase.auth();

// telling firebase to use fb id to login
const facebookProvider = new firebase.auth.FacebookAuthProvider();
facebookProvider.addScope("user_birthday");

export { auth, facebookProvider, storage };
export default db;
