import React, { useState, useEffect } from "react";
import "./Home.css";
import FamilyChart from "../Create-Tree/FamilyChart";
import LeftSideBar from "../SideBar/LeftSideBar/LeftSideBar";
import SideBar from "../SideBar/RightSideBar/SideBar";
import db from "../../Provider/firebase";

const Home = () => {
  const [minified, setMinified] = useState(true);
  const [members, setMembers] = useState();

  useEffect(() => {
    const datalist = db.ref("relatives");
    const getData = async () =>
      await datalist.once("value", (snapshot) => {
        let lists = snapshot.val();
        let newMembers = [];
        for (let id in lists) {
          newMembers.push(lists[id]);
        }
        setMembers(newMembers);
      });

    getData();

    return () => datalist.off();
  }, []);

  if (!members) {
    return (
      <div className="ui segment loading">
        <div className="ui active transition visible inverted dimmer">
          <div className="content">
            <div className="ui inverted text loader">Loading</div>
          </div>
        </div>
        <img
          src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png"
          className="ui image"
        />
      </div>
    );
  }

  return (
    <div className="home">
      <LeftSideBar />
      <FamilyChart minified={minified} members={members} />;
      <SideBar />
    </div>
  );
};

export default Home;
