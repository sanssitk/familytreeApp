import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";
import FbButton from "../Buttons/FbButton";
import { useStateValue } from "../../StateManagement/StateProvider";
import { auth } from "../../Provider/firebase";
import db from "../../Provider/firebase";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Icon } from "semantic-ui-react";

const Header = () => {
  const [{ nodeId, user, uid }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);
  const [sureSignOff, setSureSignOff] = useState(false);
  const history = useHistory();
  const [updater, setUpdate] = useState(true);
  const location = useLocation();

  const [userUid, setUserUid] = useState();

  useEffect(() => {
    db.ref("relatives")
      .orderByChild("uid")
      .equalTo(uid)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const userUId = snapshot.val();
          setUserUid(userUId);
        }
      });
  }, []);

  useEffect(() => {
    setUpdate(!updater);
  }, [location]);

  useEffect(() => {
    if (sureSignOff === true) {
      auth
        .signOut()
        .then(() => {
          dispatch({
            type: "SET_USER",
            user: null,
            uid: null,
          });
          history.push("/");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [sureSignOff]);

  const handleSignOut = () => {
    setSureSignOff(true);
    setOpen(false);
  };
  const signOutClicked = () => {
    setOpen(true);
  };

  const renderAddMemberIcon = () => {
    if (userUid) {
      return (
        <Link to="/form">
          <Icon.Group size="small">
            <Icon loading size="big" name="circle notch" />
            <Icon name="add user" />
          </Icon.Group>
        </Link>
      );
    } else {
      return <img src={user.photoURL}></img>;
    }
  };

  const modal = () => {
    return (
      <Dialog
        open={open}
        onClose={handleSignOut}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you really want to sign Off?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSignOut} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className="header">
      <div className="leftArea">
        <div className="ui fluid category search">
          <div className="ui icon input">
            <input
              className="prompt"
              type="text"
              placeholder="Search countries..."
            />
            <i className="search icon"></i>
          </div>
        </div>
      </div>

      <div className="centerArea">
        <div className="userName">
          {renderAddMemberIcon()}
          <div>{user.displayName}</div>
        </div>

        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/rules">Rules</Link>
        </div>
      </div>

      <div className="rightArea">
        <FbButton text={"Sign Out"} buttonClicked={signOutClicked} />
        {modal()}
      </div>
    </div>
  );
};

export default Header;
