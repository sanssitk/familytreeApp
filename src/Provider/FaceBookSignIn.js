// import React, { useState } from "react";
// import { facebookProvider, auth } from "./firebase";
// import { useStateValue } from "../StateManagement/StateProvider";

// export function FaceBookSignIn(user, callback) {
//   const [, dispatch] = useStateValue();
//   const result = () => {
//     if (!user) {
//       auth
//         .signInWithPopup(facebookProvider)
//         .then((res) => {
//           /** @type {firebase.auth.OAuthCredential} */
//           let credential = res.credential;
//           // The signed-in user info.
//           let user = res.user;
//           // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//           let accessToken = credential.accessToken;
//           dispatch({
//             type: "SET_USER",
//             user: user,
//           });
//           callback(user);
//         })
//         .catch((err) => {
//           // Handle Errors here.
//           var errorCode = err.code;
//           var errorMessage = err.message;
//           // The email of the user's account used.
//           var email = err.email;
//           // The firebase.auth.AuthCredential type that was used.
//           var credential = err.credential;
//         });
//     } else {
//       dispatch({
//         type: "SET_USER",
//         user: null,
//       });
//       callback(user);
//     }
//   };
//   return result;
// }
