import React from "react";
import { provider, auth } from "./firebase";

function FaceBookSignIn() {
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((res) => {
        /** @type {firebase.auth.OAuthCredential} */
        let credential = res.credential;
        // The signed-in user info.
        let user = res.user;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        let accessToken = credential.accessToken;
        console.log(user);
        console.log(accessToken);
      })
      .catch((err) => {
        // Handle Errors here.
        var errorCode = err.code;
        var errorMessage = err.message;
        // The email of the user's account used.
        var email = err.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = err.credential;
      });
  };
  return (
    <div className="faceBookSignIn">
      <button onClick={signIn}>Facebook Login</button>
    </div>
  );
}

export default FaceBookSignIn;
