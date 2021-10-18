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
import styled, { keyframes } from "styled-components";
import { FcConferenceCall } from "react-icons/fc";

function LandingPage({ newUser }) {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);
  const [secondOpen, setSecondOpen] = useState(false);
  const [userUID, setUserUID] = useState();
  const [userSelected, setUserSelected] = useState(true);
  const [allMembers, setAllMembers] = useState([]);
  const [userSelection, setUserSelection] = useState(null);
  const [allFathers, setAllfathers] = useState([]);
  const [fatherSelection, setFatherSelection] = useState(null);

  let LOGO_SIZE = "12rem";
  let DURATION = "0.7s";
  let SHADOW_HEIGHT = `${Math.round(48 / 5)}px`;
  let DROP_HEIGHT = "60px";
  let OFFSET = "12rem";

  const windowSize = window.matchMedia("(max-width: 700px)");
  const mediaQuery = (windowSize) => {
    if (windowSize.matches) {
      LOGO_SIZE = "8rem";
      DURATION = "0.7s";
      SHADOW_HEIGHT = `${Math.round(48 / 5)}px`;
      DROP_HEIGHT = "40px";
      OFFSET = "4rem";
    } else {
      LOGO_SIZE = "12rem";
      DURATION = "0.7s";
      SHADOW_HEIGHT = `${Math.round(48 / 5)}px`;
      DROP_HEIGHT = "60px";
      OFFSET = "12rem";
    }
  };
  windowSize.addListener(mediaQuery);
  mediaQuery(windowSize);

  const bounce = keyframes`
  from {
    transform: translateY(0) scale(1);
  }
  to {
    transform: translateY(${DROP_HEIGHT}) scale(1, 0.7);
  }
`;

  const grow = keyframes`
  from {
    transform: scale(0.2, 0.5);
  }
  to {
    transform: scale(1.5, 0.8);
  }
`;

  const LogoWrapper = styled(FcConferenceCall)`
    width: ${LOGO_SIZE};
    height: ${LOGO_SIZE};
    position: absolute;
    top: ${OFFSET};
    left: calc(50% - ${LOGO_SIZE} / 2);
    animation-name: ${bounce};
    animation-duration: ${DURATION};
    animation-direction: alternate;
    animation-timing-function: cubic-bezier(0.95, 0.05, 0.795, 0.035);
    animation-iteration-count: infinite;
  `;

  const Shadow = styled.div`
    width: ${LOGO_SIZE};
    height: ${SHADOW_HEIGHT};
    background: radial-gradient(
      50% 50%,
      rgba(150, 150, 150, 1),
      rgba(150, 150, 150, 0.05)
    );
    position: absolute;
    top: calc(
      ${OFFSET} + ${DROP_HEIGHT} + ${LOGO_SIZE} - 1.5 * ${SHADOW_HEIGHT}
    );
    left: calc(50% - ${LOGO_SIZE} / 2);
    animation-name: ${grow};
    animation-duration: ${DURATION};
    animation-direction: alternate;
    animation-timing-function: cubic-bezier(0.95, 0.05, 0.795, 0.035);
    animation-iteration-count: infinite;
  `;

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
            let fatherCol = [];
            datas.forEach((data) => {
              let userdata = data.val();
              if (!userdata.uid) {
                memCol.push(userdata);
                if (userdata.data.gender == "M") {
                  fatherCol.push(userdata);
                }
              }
            });
            setAllMembers(memCol);
            setAllfathers(fatherCol);
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

  const handleFatherSelected = () => {
    if (fatherSelection && user.uid) {
      let query = async () => {
        let items = await db
          .ref("relatives")
          .orderByChild("id")
          .equalTo(fatherSelection)
          .once("value");
        return items;
      };
      query().then((snapshot) => {
        let mother = "";
        snapshot.forEach((datas) => {
          mother = datas.val().rels.spouses[0];
        });
        dispatch({
          type: "ADD_MEMBER",
          member: "Children",
        });
        dispatch({
          type: "NODE_ID",
          nodeId: [fatherSelection, mother],
        });
      });
      setSecondOpen(false);
      setOpen(false);
    }
  };

  const renderModal = () => {
    return (
      <Modal
        onClose={(e) => {
          if (e) {
            window.history.back();
            setOpen(false);
          }
        }}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button>Show Modal</Button>}
      >
        {/*************** firstModal ***************/}
        <Modal.Header>
          Select if you are in the list?
          <Modal.Actions>
            <Button onClick={() => setSecondOpen(true)} color="blue">
              <Icon name="add user" /> सूचीमा छैन
            </Button>
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
          <Button onClick={() => setSecondOpen(true)} color="blue">
            <Icon name="add user" /> सूचीमा छैन
          </Button>
          <Button onClick={handleSaveClicked} positive disabled={userSelected}>
            छानेकोलाइ सुरक्षित
          </Button>
        </Modal.Actions>
        {/*************** secondModal ***************/}
        <Modal
          onClose={() => setSecondOpen(false)}
          open={secondOpen}
          size="small"
        >
          <Modal.Header>के तपाईंको बुवा सुचीमा हुनुहुन्छ ? </Modal.Header>
          <Modal.Actions>
            <Link
              to={{
                pathname: "/form",
                state: {
                  isUserUid: true,
                },
              }}
              onClick={() => {
                setSecondOpen(false);
                setOpen(false);
              }}
            >
              <Button color="blue">
                <Icon name="add user" /> सूचीमा छैन
              </Button>
            </Link>
            <Link
              to={{
                pathname: "/form",
                state: {
                  isUserUid: true,
                },
              }}
              onClick={() => {
                handleFatherSelected();
                setSecondOpen(false);
                setOpen(false);
              }}
            >
              <Button
                icon="plus"
                content="All Done"
                positive
                disabled={userSelected}
              >
                छानेकोलाइ सुरक्षित
              </Button>
            </Link>
          </Modal.Actions>
          <Modal.Content>
            {allFathers.map((father) => (
              <div
                key={father.id}
                id={father.id}
                className={
                  father.id === fatherSelection ? "easeUserActive" : "eachUser"
                }
                onClick={(e) => {
                  setFatherSelection(e.currentTarget.id);
                  setUserSelected(false);
                }}
              >
                <div
                  className="userImage"
                  style={{ backgroundImage: `url(${father.data.image})` }}
                ></div>
                <Modal.Description>
                  <p>
                    {father.data.firstName} {father.data.lastName}
                  </p>
                  <p>{father.data.address}</p>
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
              <Button color="blue">
                <Icon name="add user" /> सूचीमा छैन
              </Button>
            </Link>
            <Button
              icon="plus"
              content="All Done"
              positive
              disabled={userSelected}
            >
              छानेकोलाइ सुरक्षित
            </Button>
          </Modal.Actions>
        </Modal>
      </Modal>
    );
  };

  return (
    <div className="landingPage">
      <LogoWrapper />
      <Shadow />
      <h1 className="title" style={{ color: "white", fontSize: "3rem" }}>
        श्रेष्ठ परिवार
      </h1>
      <FbButton text="Login with Facebook" buttonClicked={logInClicked} />
      {open && allMembers ? renderModal() : ""}
    </div>
  );
}

export default LandingPage;
