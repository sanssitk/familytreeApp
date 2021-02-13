import React from "react";
import { provider, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FacebookIcon from "@material-ui/icons/Facebook";
import { useStateValue } from "../StateManagement/stateProvider";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2),
  },
}));

function FaceBookSignIn() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();

  const signIn = () => {
    if (!user) {
      auth
        .signInWithPopup(provider)
        .then((res) => {
          /** @type {firebase.auth.OAuthCredential} */
          let credential = res.credential;
          // The signed-in user info.
          let user = res.user;
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          let accessToken = credential.accessToken;
          dispatch({
            type: "SET_USER",
            user: user.displayName,
          });
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
    } else {
      auth.signOut();
      dispatch({
        type: "SET_USER",
        user: null,
      });
    }
  };

  return (
    <div className="faceBookSignIn">
      <Button
        startIcon={<FacebookIcon />}
        color="primary"
        variant="contained"
        onClick={signIn}
        className={classes.button}
      >
        <span>{user ? "Sign Out" : "Log in with Facebook"}</span>
      </Button>
    </div>
  );
}

export default FaceBookSignIn;
