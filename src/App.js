import "./App.css";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { useStateValue } from "./StateManagement/StateProvider";
import { auth } from "./Provider/firebase";

import LandingPage from "./Components/LandingPage/LandingPage";
import Home from "./Components/Home/Home";

const App = () => {
  const [{ user, uid }, dispatch] = useStateValue();

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

  return (
    <Router>
      <div className="app">
        <Switch>
          {user ? (
            <Route path={`/home/${user.displayName.split(" ")[0]}=${uid}`}>
              <Home />
            </Route>
          ) : (
            ""
          )}
          <Route path="/" exact>
            <LandingPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
