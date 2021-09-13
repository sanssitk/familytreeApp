import React, { useEffect } from "react";
import FbButton from "../Buttons/FbButton";
import { facebookProvider, auth } from "../../Provider/firebase";
import { useStateValue } from "../../StateManagement/StateProvider";
import { useHistory } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      signIn(user);
    }
  }, [user]);

  const signIn = (user) => {
    if (user) {
      dispatch({
        type: "SET_USER",
        user: user,
        uid: user.uid,
      });
      history.push(`/home/${user.displayName.split(" ")[0]}=${user.uid}`);
    }
  };

  const logInClicked = () => {
    if (!user) {
      auth
        .signInWithPopup(facebookProvider)
        .then((res) => {
          /** @type {firebase.auth.OAuthCredential} */
          let user = res.user;
          signIn(user);
        })
        .catch((err) => {
          var errorMessage = err.message;
          var email = err.email;
          var credential = err.credential;
          throw new Error(errorMessage, email, credential);
        });
    }
  };

  return (
    <div className="landingPage">
      <h1 style={{ color: "white" }}>Shrestha APP</h1>
      <FbButton text="Login with Facebook" buttonClicked={logInClicked} />
    </div>
  );
}

export default LandingPage;
