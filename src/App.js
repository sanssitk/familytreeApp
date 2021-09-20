import "./App.css";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { useStateValue } from "./StateManagement/StateProvider";
import db from "./Provider/firebase";
import { auth } from "./Provider/firebase";

import Header from "./Components/Header/Header";
import LandingPage from "./Components/LandingPage/LandingPage";
import LoginUserForm from "./Components/Forms/LoginUserForm";
import Home from "./Components/Home/Home";
import Events from "./Routes/Events";
import Rules from "./Routes/Rules";

const App = () => {
  const [{ user, uid, nodeId }, dispatch] = useStateValue();

  const [userUid, setUserUid] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // the user is logged in......
        dispatch({
          type: "SET_USER",
          user: user,
          uid: user.uid,
        });
      } else {
        // user is logged out......
        dispatch({
          type: "SET_USER",
          user: null,
          uid: null,
        });
      }
    });

    return () => {
      // Any cleanup operations go here if refreshed
      unsubscribe();
    };
  }, []);

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

  return (
    <Router>
      <div className="app">
        {user ? <Header userUid={userUid} /> : ""}
        <Switch>
          {user ? (
            <Route path={`/home/${user.displayName.split(" ")[0]}=${uid}`}>
              <Home />
            </Route>
          ) : (
            ""
          )}
          <Route path="/events" exact>
            <Events />
          </Route>
          <Route path="/rules" exact>
            <Rules />
          </Route>
          <Route path="/form" exact>
            <LoginUserForm userUid={userUid} />
          </Route>
          <Route path="/" exact>
            <LandingPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
