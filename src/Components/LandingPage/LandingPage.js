import React, { useEffect, useState } from "react";
import FbButton from "../Buttons/FbButton";
import { facebookProvider, auth } from "../../Provider/firebase";
import db from "../../Provider/firebase";
import { useStateValue } from "../../StateManagement/StateProvider";
import { useHistory } from "react-router-dom";
import { dbServices } from "../../Services/firebaseServices";
import { Button, Modal } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import "./LandingPage.css";

function LandingPage({ newUser }) {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [userSelection, setUserSelection] = useState(null);
  const [userUID, setUserUID] = useState();
  const [userSelected, setUserSelected] = useState(true);

  // useEffect(() => {
  //   if (user) {
  //     signIn(user);
  //     dbServices.getFbKey(user.uid, callback);
  //   }
  // }, [user]);

  // const callback = (key) => {
  //   dispatch({
  //     type: "FB_KEY",
  //     fbKey: key,
  //   });
  // };

  const signIn = (user) => {
    const callback = (datas) => {
      if (datas) {
        dispatch({
          type: "SET_USER",
          user: user,
          uid: user.uid,
        });
        history.push(`/home/${user.displayName.split(" ")[0]}=${user.uid}`);
      } else {
        // render find your self in database
        db.ref("relatives")
          .get()
          .then((datas) => {
            let memCol = [];
            datas.forEach((data) => {
              let userdata = data.val();
              if (!userdata.uid) {
                memCol.push(userdata);
              }
            });
            setAllMembers(memCol);
            setUserUID(user);
          });
        setOpen(true);
      }
    };
    dbServices.readDB(user.uid, callback);
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
  const handleSaveClicked = () => {
    if (userSelection) {
      let query = db.ref("relatives").orderByChild("id").equalTo(userSelection);
      query.once("child_added", (snapshot) => {
        snapshot.ref.update({ ...snapshot.val(), uid: userUID.uid });
      });
      newUser(userUID);
      history.push(`/home/${userUID.displayName.split(" ")[0]}=${userUID.uid}`);
      setOpen(false);
    }
  };

  const renderModal = () => {
    return (
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button>Show Modal</Button>}
      >
        <Modal.Header>
          Select if you are in the list?
          <Modal.Actions>
            <Link
              to={{
                pathname: "/form",
                state: {
                  isUserUid: true,
                },
              }}
              onClick={() => setOpen(false)}
            >
              <Button onClick={() => setOpen(false)} color="blue">
                <Icon name="add user" /> सूचीमा छैन
              </Button>
            </Link>
            <Button
              onClick={handleSaveClicked}
              positive
              disabled={userSelected}
            >
              छानेकोलाइ सुरक्षित
            </Button>
          </Modal.Actions>
        </Modal.Header>

        <Modal.Content>
          {allMembers.map((mem) => (
            <div
              key={mem.id}
              id={mem.id}
              className={
                mem.id === userSelection ? "easeUserActive" : "eachUser"
              }
              onClick={(e) => {
                setUserSelection(e.currentTarget.id);
                setUserSelected(false);
              }}
            >
              <div
                className="userImage"
                style={{ backgroundImage: `url(${mem.data.image})` }}
              ></div>
              <Modal.Description>
                <p>
                  {mem.data.firstName} {mem.data.lastName}
                </p>
                <p>{mem.data.address}</p>
              </Modal.Description>
            </div>
          ))}
        </Modal.Content>

        <Modal.Actions>
          <Link
            to={{
              pathname: "/form",
              state: {
                isUserUid: true,
              },
            }}
            onClick={() => setOpen(false)}
          >
            <Button onClick={() => setOpen(false)} color="blue">
              <Icon name="add user" /> सूचीमा छैन
            </Button>
          </Link>
          <Button onClick={handleSaveClicked} positive disabled={userSelected}>
            छानेकोलाइ सुरक्षित
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  return (
    <div className="landingPage">
      <img src="/favicon.ico" alt="logo" height="100vw" />
      <h1 style={{ color: "white", fontSize: "3rem" }}>श्रेष्ठ परिवार </h1>
      <FbButton text="Login with Facebook" buttonClicked={logInClicked} />
      {open && allMembers ? renderModal() : ""}
    </div>
  );
}

export default LandingPage;
