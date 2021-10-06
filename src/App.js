import "./App.css";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { useStateValue } from "./StateManagement/StateProvider";
import { auth } from "./Provider/firebase";
import Header from "./Components/Header/Header";
import LandingPage from "./Components/LandingPage/LandingPage";
import LoginUserForm from "./Components/Forms/LoginUserForm";
import Home from "./Components/Home/Home";
import Events from "./Routes/Events";
import Rules from "./Routes/Rules";
import AddMember from "./Routes/AddMember";
import Footer from "./Components/Footer/Footer"

const App = () => {
  const [{ user, uid, member }, dispatch] = useStateValue();
  const [newMember, setNewMember] = useState();

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

  const newUser = (newUser) => {
    if (newUser) {
      setNewMember(newUser);
    }
  };

  return (
    <Router>
      <div className="app">
        {user ? <Header newMember={newMember} /> : ""}
        <Switch>
          {user ? (
            <Route path={`/home/${user.displayName.split(" ")[0]}=${user.uid}`}>
              <Home />
            </Route>
          ) : (
            ""
          )}
          <Route path={`/add${member}`} exact>
            <AddMember />
          </Route>
          <Route path="/events" exact>
            <Events />
          </Route>
          <Route path="/rules" exact>
            <Rules />
          </Route>
          <Route path="/form" exact>
            <LoginUserForm />
          </Route>
          <Route path="/" exact>
            <LandingPage newUser={newUser} />
          </Route>
        </Switch>
        {user ? <Footer /> : ""}
      </div>
    </Router>
  );
};

export default App;
