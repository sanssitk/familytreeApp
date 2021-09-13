import React, { useState } from "react";
import "./Home.css";
import FamilyChart from "../Create-Tree/FamilyChart";
import LeftSideBar from "../SideBar/LeftSideBar/LeftSideBar";
import SideBar from "../SideBar/RightSideBar/SideBar";

const Home = () => {
  const [minified, setMinified] = useState(true);

  return (
    <div className="home">
      <LeftSideBar />
      <FamilyChart minified={minified} />
      <SideBar />
    </div>
  );
};

export default Home;
