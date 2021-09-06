export const LogInOutButton = () => {
  
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();

  const buttonClicked = () => {
    if (!user) {
      auth
        .signInWithPopup(facebookProvider)
        .then((res) => {
          /** @type {firebase.auth.OAuthCredential} */
          let user = res.user;
          console.log(user.uid);
          dispatch({
            type: "SET_USER",
            user: user,
          });
          localStorage.setItem("user", JSON.stringify(user));
          history.push("/home");
        })
        .catch((err) => {
          var errorMessage = err.message;
          var email = err.email;
          var credential = err.credential;
          throw new Error(errorMessage, email, credential);
        });
    } else {
      auth
        .signOut()
        .then(() => {
          dispatch({
            type: "SET_USER",
            user: null,
          });
          history.push("/");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  };
  return (
    // <Button
    //   variant="contained"
    //   color="primary"
    //   className={classes.button}
    //   startIcon={<FacebookIcon style={{ fontSize: 24 }} />}
    //   onClick={buttonClicked}
    // >
    //   <strong>{user ? "Sign Off" : "Login"}</strong>
    // </Button>
  );
};
