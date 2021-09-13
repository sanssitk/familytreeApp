import React from "react";
import "./sidebar.css";
import { useStateValue } from "../../../StateManagement/StateProvider";

const SideBar = () => {
  const [{ nodeId }, dispatch] = useStateValue();

  const handleClick = () => {
    dispatch({
      type: "NODE_ID",
      nodeId: null,
    });
  };

  return (
    <div
      className="rightSideBar"
      style={{ transform: nodeId ? "translateX(0)" : "translateX(100%)" }}
      onClick={handleClick}
    >
      <nav>
        <h1>Details</h1>
        <img
          className="userPhoto"
          src={
            "https://www.pikpng.com/pngl/m/80-805068_my-profile-icon-blank-profile-picture-circle-clipart.png"
          }
        ></img>
        <h4>Name: {nodeId}</h4>
        <h4>Date of Birth: 02/20/1987</h4>
        <h4>Name: First Name</h4>
        <h4>Name: First Name</h4>
        <h4>Name: First Name</h4>
        <h4>Name: First Name</h4>
      </nav>
    </div>
  );
};

export default SideBar;
