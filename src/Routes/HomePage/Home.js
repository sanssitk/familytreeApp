import React from "react";
import "./Home.css";
import FaceBookSignIn from "../../Provider/FaceBookSignIn";
import { useStateValue } from "../../StateManagement/stateProvider";
import NavBar from "./NavBar";

function Home() {
  const [{ user }, dispatch] = useStateValue();
  return (
    <div className="home">
      <NavBar />
      <div className="bodyContainer"></div>
      {user ? "Home page " : "Home page Not Login in"}
      <FaceBookSignIn />
    </div>
  );
}

export default Home;
