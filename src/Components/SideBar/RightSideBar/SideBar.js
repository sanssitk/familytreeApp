import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useStateValue } from "../../../StateManagement/StateProvider";
import db from "../../../Provider/firebase";
import { getCurrentNode } from "../../Helpers/firebaseCRUD";

const SideBar = () => {
  const [{ nodeId, uid, user }, dispatch] = useStateValue();
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

  const handleCancelClick = () => {
    dispatch({
      type: "NODE_ID",
      nodeId: null,
    });
  };

  const data = {
    id: "12",
    rels: {
      father: "",
      mother: "",
      spouses: ["3"],
      children: [],
      brother: [],
      sister: [],
    },
    data: {
      "first name": "Name",
      "last name": "Surname",
      birthday: 1970,
      gender: "F",
      firstName: "Test",
      lastName: "Test",
      birthDate: "1988 AD",
      image: "",
      deathDate: "",
      birthPlace: "Cologne, Germany",
      deathPlace: "Unknown",
      phoneNumber: "7048904961",
      email: "",
      jobDetails: "",
      address: "",
    },
  };

  const renderButtons = () => {
    if (sideDetails && uid === sideDetails.uid) {
      return (
        <div className="editButtons">
          <div className="fluid ui buttons spacing">
            <button
              className="ui grey button"
              onClick={() => getCurrentNode(3, "spouses", data)}
            >
              <i className="icon user"></i>+ Father
            </button>
            <button className="ui grey button">
              <i className="icon user"></i>+ Mother
            </button>
          </div>
          <div className="fluid ui buttons spacing">
            <button className="ui grey button">
              <i className="icon user"></i>+ Add Son
            </button>
            <button className="ui grey button">
              <i className="icon user"></i>+ Daughter
            </button>
          </div>
          <div className="fluid ui buttons spacing">
            <button className="ui grey button">
              <i className="icon user"></i>+ Brother
            </button>
            <button className="ui grey button">
              <i className="icon user"></i>+ SIS-TERS
            </button>
          </div>

          <div className="fluid ui buttons">
            <button className="ui blue button">
              <i className="icon user"></i>
              Edit Profile
            </button>
            <div className="or"></div>
            <button className="ui red button" onClick={handleCancelClick}>
              Cancel
            </button>
            <div className="or"></div>
            <button className="ui positive button">Save</button>
          </div>
        </div>
      );
    }
  };
  const renderUserInfo = () => {
    if (sideDetails) {
      return (
        <nav>
          <div className="userBasicInfo">
            <div
              className="userPicture"
              style={{
                backgroundImage: `url(${user.photoURL})`,
              }}
            ></div>
            <div className="userTitles">
              <h3>
                {`${sideDetails.data.firstName} ${sideDetails.data.lastName}`}
              </h3>
              <h3>Tel: {sideDetails.data.phoneNumber}</h3>
              <h3>Email: {sideDetails.data.email}</h3>
            </div>
          </div>
          <div className="userMoreInfo">
            <div className="userMoreInfoTitle">
              <p>DOB:</p>
              <p>Address:</p>
              <p>Job:</p>
              <p>Father:</p>
              <p>Mother:</p>
              <p>Brother:</p>
              <p>Sister:</p>
            </div>
            <div className="userMoreInfoDetails">
              <input
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.0)",
                  border: "none",
                  color: "white",
                }}
                type="text"
                placeholder={sideDetails.data.birthDate}
              />
              <p>
                {sideDetails.data.address === ""
                  ? "N/a"
                  : sideDetails.data.address}
              </p>
              <p>
                {sideDetails.data.jobDetails === ""
                  ? "N/a"
                  : sideDetails.data.jobDetails}
              </p>
              <p>Father</p>
              <p>Mother</p>
              <p>Brother</p>
              <p>Sister</p>
            </div>
          </div>
        </nav>
      );
    }
  };

  return (
    <div
      className="rightSideBar"
      style={{ transform: nodeId ? "translateX(0)" : "translateX(100%)" }}
    >
      <div className="sidebarButton">
        <i className="angle left icon" onClick={handleCancelClick}></i>
        <h1>Details</h1>
      </div>
      {renderUserInfo()}
      {renderButtons()}
    </div>
  );
};

export default SideBar;
