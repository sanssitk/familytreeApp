import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useStateValue } from "../../../StateManagement/StateProvider";
import db from "../../../Provider/firebase";
import DetailsComponent from "./DetailsComponent";
import ProfilePicture from "./ProfilePicture";
import UploadFile from "../../FileUploader/UploadFile";
import {
  dbServices,
  storageServices,
} from "../../../Services/firebaseServices";
import AddButtons from "./AddButtons";
import { v4 as uuidv4 } from "uuid";

export default React.memo(function SideBar() {
  const [{ nodeId, uid }, dispatch] = useStateValue();
  const [sideDetails, setSidedetails] = useState();
  const [disableEdit, setDisableEdit] = useState(true);
  const [saveActive, setSaveActive] = useState(false);
  const [address, setAddress] = useState();
  const [job, setJob] = useState();
  const [fbImageUrl, setFbImageUrl] = useState();
  const buttonLists = [
    "Spouses",
    "Children",
    "Father",
    "Mother",
    "Brother",
    "Sister",
  ];

  useEffect(() => {
    let mounted = true;
    if (!nodeId) return;
    if (mounted) {
      const getData = db.ref("relatives");
      getData
        .orderByChild("id")
        .equalTo(nodeId)
        .limitToFirst(1)
        .on("value", (snapshot) => {
          snapshot.forEach((data) => {
            setSidedetails(data.val());
          });
        });
    }
    return () => (mounted = false);
  }, [nodeId]);

  const renderInfos = (details) => {
    const datas = details?.data;
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

  const handleCancelClick = () => {
    renderInfos();
    dispatch({
      type: "NODE_ID",
      nodeId: null,
    });
    setSidedetails(null);
    setDisableEdit(true);
  };

  const savePicture = (fbUrl) => {
    setFbImageUrl(fbUrl);
    setSaveActive(true);
  };

  const getImageUrl = (url) => {
    try {
      const data = {
        title: "image",
        value: url,
      };
      dbServices.updateData(uid, data);
    } catch {
      alert("Image cannot be uploaded at this time..");
    }
  };

  const handleSaveUpload = () => {
    if (job) {
      dbServices.updateData(uid, job);
    }
    if (address) {
      dbServices.updateData(uid, address);
    }
    if (fbImageUrl) {
      storageServices.add(uid, fbImageUrl, getImageUrl);
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

  const renderButtons = () => {
    if (
      sideDetails &&
      uid === sideDetails?.uid &&
      sideDetails?.data.gender !== "F"
    ) {
      return (
        <div className="editButtons">
          <div className="three ui buttons segment">
            {buttonLists.map((buttonlist, i) => (
              <AddButtons key={i} buttonlist={buttonlist} />
            ))}
            {!disableEdit && <UploadFile callback={savePicture} />}
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
    } else {
      return "";
    }
  };

  // dummy path
  // const saveMember = () => {
  //   const newMember = {
  //     id: uuidv4(),
  //     uid: "",
  //     rels: {
  //       // spouses: ["4905b61f-5540-4840-831f-b95af66b4d3d"],
  //       // children: [""],
  //       // Goma Shrestha Katuwal
  //       father: "b0efb939-bccb-413f-b2ee-4bd6a5d91161",
  //       mother: "8aa2a9af-4b50-4c9c-b4b6-6043d094e81e",
  //     },
  //     data: {
  //       birthday: "1922-07-17",
  //       gender: "F",
  //       firstName: "Goma Shrestha",
  //       lastName: "Katuwal",
  //       birthDate: "1922-07-17",
  //       image: "",
  //       birthPlace: "Jhapa",
  //       phoneNumber: "N/A",
  //       email: "N/A",
  //       jobDetails: "house wife",
  //       address: "Itahari",
  //     },
  //   };
  //   dbServices.addDB(newMember);
  // };

  return (
    <div
      className={nodeId ? "active rightSideBar" : "rightSideBar"}
      style={{
        transform: nodeId ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <div className="sidebarButton">
        <i className="angle left icon" onClick={handleCancelClick}></i>
        <h1>Details</h1>
      </div>
      {sideDetails && (
        <ProfilePicture sideDetails={sideDetails} renderInfos={renderInfos} />
      )}
      {renderButtons()}
      {/* <button className="dummy" onClick={saveMember}>
        DUMMY
      </button> */}
    </div>
  );
});
