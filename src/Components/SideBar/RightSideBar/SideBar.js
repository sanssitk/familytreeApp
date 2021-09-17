import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useStateValue } from "../../../StateManagement/StateProvider";
import db from "../../../Provider/firebase";

const SideBar = () => {
  const [{ nodeId, uid }, dispatch] = useStateValue();
  const [sideDetails, setSidedetails] = useState(nodeId);

  useEffect(() => {
    if (!nodeId) return;
    const getData = db.ref("relatives");
    getData
      .orderByChild("id")
      .equalTo(nodeId)
      .on("value", (snapshot) => {
        snapshot.forEach((data) => {
          setSidedetails(data.val());
        });
      });
  }, [nodeId]);

  const handleClick = () => {
    dispatch({
      type: "NODE_ID",
      nodeId: null,
    });
  };

  const addFather = () => {
    const shresthaDB = db.ref("relatives");
    const data = {
      id: "3",
      rels: {
        father: "1",
        mother: "2",
      },
      data: {
        "first name": "Name",
        "last name": "Surname",
        birthday: 2015,
        gender: "M",
        firstName: "Sakar",
        lastName: "Shrestha",
        birthDate: "2015 AD",
        image: "",
        deathDate: "",
        birthPlace: "US",
        deathPlace: "",
        phoneNumber: "7048904961",
        email: "",
        jobDetails: "",
        address: "",
      },
    };
    shresthaDB.push(data);
  };

  const getFather = () => {
    const data = {
      id: "1",
      postBy: "",
      postOn: "",
      event: "This is 2 test",
    };
    db.ref("events").push(data);
  };

  // console.log("uid", uid);
  // sideDetails && console.log("firebase", sideDetails.uid);

  const renderButtons = () => {
    if (sideDetails && uid === sideDetails.uid) {
      return (
        <div>
          <button>Edit Info</button>
          <button>+ Son</button>
          <button>+ Daughter</button>
          <button onClick={addFather}>+ Father</button>
          <button>+ Mother</button>
          <button>+ Brother</button>
          <button>+ Sister</button>
          <button>Save</button>
          <button onClick={handleClick}>Cancel</button>
          <button onClick={getFather}>get Father</button>
        </div>
      );
    }
  };

  return (
    <div
      className="rightSideBar"
      style={{ transform: nodeId ? "translateX(0)" : "translateX(100%)" }}
    >
      <nav>
        <i className="angle left icon" onClick={handleClick}></i>
        <h1>Details</h1>
        <img
          className="userPhoto"
          src={
            "https://www.pikpng.com/pngl/m/80-805068_my-profile-icon-blank-profile-picture-circle-clipart.png"
          }
        />
        <h4>FirstName: {sideDetails && sideDetails.data.firstName}</h4>
        <h4>LastName: {sideDetails && sideDetails.data.lastName}</h4>
        <h4>Contact: {sideDetails && sideDetails.data.phoneNumber}</h4>
        <h4>Email: {sideDetails && sideDetails.data.email}</h4>
        <h4>Address: {sideDetails && sideDetails.data.address}</h4>
        <h4>Date of Birth: {sideDetails && sideDetails.data.birthDate}</h4>
        <h4>Job: {sideDetails && sideDetails.data.jobDetails}</h4>
        {renderButtons()}
      </nav>
    </div>
  );
};

export default SideBar;
