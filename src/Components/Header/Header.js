import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";
import FbButton from "../Buttons/FbButton";
import { useStateValue } from "../../StateManagement/StateProvider";
import { auth } from "../../Provider/firebase";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Icon } from "semantic-ui-react";
import db from "../../Provider/firebase";
import { FaRegWindowClose, FaBars } from "react-icons/fa";
import { Nav } from "./NavBarElements";

const Header = () => {
  const [userUid, setUserUid] = useState();
  const [{ user, uid }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);
  const [sureSignOff, setSureSignOff] = useState(false);
  const history = useHistory();
  const [updater, setUpdate] = useState(true);
  const location = useLocation();
  const [navListOpen, setNavListOpen] = useState(false);

  useEffect(() => {
    db.ref("relatives")
      .orderByChild("uid")
      .equalTo(uid)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const uUid = snapshot.val();
          setUserUid(uUid);
        }
      });
  }, [updater]);

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
    if (!userUid) {
      return (
        <Link
          to={{
            pathname: "/form",
            state: {
              isUserUid: true,
            },
          }}
        >
          <Icon.Group size="small">
            <Icon loading size="big" name="circle notch" />
            <Icon name="add user" />
          </Icon.Group>
        </Link>
      );
    } else {
      return (
        <img
          src={user.photoURL}
          onClick={() =>
            dispatch({
              type: "NODE_ID",
              nodeId: uid,
            })
          }
        ></img>
      );
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
      <div className="userName">
        {renderAddMemberIcon()}
        <div>{user.displayName}</div>
      </div>

      <div className="centerArea">
        <div className="ui fluid category search">
          <div className="ui icon input">
            <input
              className="prompt"
              type="text"
              placeholder="Search names..."
            />
            <i className="search icon"></i>
          </div>
        </div>

        <div className="links">
          <Nav>
            <ul className={navListOpen ? "mobileMenu" : "navList"}>
              <Link to="/" onClick={() => setNavListOpen(false)}>
                <li>Home</li>
              </Link>
              <Link to="/events" onClick={() => setNavListOpen(false)}>
                <li>Events</li>
              </Link>
              <Link to="/rules" onClick={() => setNavListOpen(false)}>
                <li>Rules</li>
              </Link>
              <Link to="/" onClick={() => setNavListOpen(false)}>
                <li>
                  <FbButton text={"Sign Out"} buttonClicked={signOutClicked} />
                  {modal()}
                </li>
              </Link>
            </ul>
            <div className="mobileButton">
              {navListOpen ? (
                <FaRegWindowClose
                  color="white"
                  fontFamily="1.5rem"
                  onClick={() => setNavListOpen(false)}
                />
              ) : (
                <FaBars
                  color="white"
                  fontFamily="1.5rem"
                  onClick={() => setNavListOpen(true)}
                />
              )}
            </div>
          </Nav>
        </div>
      </div>
    </div>
  );
};

{
  /* <Nav>
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

      <div className="userName">
        {renderAddMemberIcon()}
        <div>{user.displayName}</div>
      </div>

      <Bars />
      <NavMenu className="links">
        <NavLink to="/" activeStyle>
          Home
        </NavLink>
        <NavLink to="/events" activeStyle>
          Events
        </NavLink>
        <NavLink to="/rules" activeStyle>
          Rules
        </NavLink>
        <NavLink to="/">
          <FbButton text={"Sign Out"} buttonClicked={signOutClicked} />
          {modal()}
        </NavLink>
      </NavMenu>
    </Nav> */
}
export default Header;
