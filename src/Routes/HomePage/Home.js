import React from "react";
import FaceBookSignIn from "../../Provider/FaceBookSignIn";
import { useStateValue } from "../../StateManagement/stateProvider";

function Home() {
  const [{ user }, dispatch] = useStateValue();
  return (
    <div className="home">
      {user ? "Home page " : "Home page Not Login in"}
      <FaceBookSignIn />
    </div>
  );
}

export default Home;
