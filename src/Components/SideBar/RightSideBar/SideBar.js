import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useStateValue } from "../../../StateManagement/StateProvider";
import db from "../../../Provider/firebase";
import DetailsComponent from "./DetailsComponent";
import ProfilePicture from "./ProfilePicture";
import { dbServices } from "../../../Services/firebaseServices";
import AddButtons from "./AddButtons";


const SideBar = () => {
  const [{ nodeId, uid }, dispatch] = useStateValue();
  const [sideDetails, setSidedetails] = useState();
  const [disableEdit, setDisableEdit] = useState(true);
  const [saveActive, setSaveActive] = useState(false);

  const [address, setAddress] = useState();
  const [job, setJob] = useState();
  const [transfrom, setTransform] = useState("translateX(100%)")

  const buttonLists = [
    "Spouses",
    "Children",
    "Father",
    "Mother",
    "Brother",
    "Sister",
  ];

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
  useEffect(() => {
    if (nodeId && window.innerWidth > 768){
      setTransform("translateX(0)")
    }
    if (!nodeId && window.innerWidth > 768){
      setTransform("translateX(100%)")
    }
    if (nodeId && window.innerWidth < 768){
      setTransform("translateX(-81vw)")
    }
    if (!nodeId && window.innerWidth < 768){
      setTransform("translateX(100%)")
    }
  }, [nodeId]);

  const handleCancelClick = () => {
    renderInfos();
    dispatch({
      type: "NODE_ID",
      nodeId: null,
    });
    setSidedetails(null);
    setDisableEdit(true);
  };

  const renderInfos = () => {
    const datas = sideDetails?.data;
    const lists = [];
    for (const property in datas) {
      lists.push({ title: property, text: datas[property] });
    }
    return lists.map((list, i) => {
      if (
        list.title !== "firstName" &&
        list.title !== "lastName" &&
        list.title !== "phoneNumber" &&
        list.title !== "image" &&
        list.title !== "gender" &&
        list.title !== "email"
      ) {
        return (
          <DetailsComponent
            key={i}
            title={list.title}
            text={list.text}
            toggleDisable={disableEdit}
            handleChange={handleChange}
          />
        );
      }
    });
  };

  const renderButtons = () => {
    if (sideDetails && uid === sideDetails.uid) {
      return (
        <div className="editButtons">
          <div className="three ui buttons segment">
            {buttonLists.map((buttonlist, i) => (
              <AddButtons key={i} buttonlist={buttonlist} />
            ))}
          </div>

          <div className="fluid ui buttons">
            <button
              onClick={() => setDisableEdit(false)}
              className="ui blue button"
            >
              <i className="icon user"></i>
              Edit Profile
            </button>
            <div className="or"></div>
            <button className="ui red button" onClick={handleCancelClick}>
              Cancel
            </button>
            <div className="or"></div>
            <button
              onClick={handleSaveUpload}
              className={`ui positive button ${saveActive ? "" : "disabled"}`}
            >
              Save
            </button>
          </div>
        </div>
      );
    }
  };

  const handleSaveUpload = () => {
    if (job) {
      dbServices.updateData(uid, job);
    }
    if (address) {
      dbServices.updateData(uid, address);
    }
    setDisableEdit(true);
    setSaveActive(false);
  };

  const handleSave = (target) => {
    const title = target.title;
    const value = target.value;
    const data = {
      title: title,
      value: value,
    };
    if (data.title === "address") {
      setAddress(data);
    }
    if (data.title === "jobDetails") {
      setJob(data);
    }
  };

  const handleChange = (e) => {
    if (e.target.value) {
      setSaveActive(true);
      handleSave(e.target);
    }
  };

  return (
    <div
      className="rightSideBar"
      style={{
        transform: nodeId ? "translateX(0)" : "translateX(100%)",
      } }
    > 
      <div className="sidebarButton">
        <i className="angle left icon" onClick={handleCancelClick}></i>
        <h1>Details</h1>
      </div>
      {sideDetails && (
        <ProfilePicture sideDetails={sideDetails} renderInfos={renderInfos} />
      )}
      {renderButtons()}
    </div>
  );
};

export default SideBar;
