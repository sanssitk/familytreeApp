import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useStateValue } from "../StateManagement/StateProvider";
import { dbServices, storageServices } from "../Services/firebaseServices";
import db from "../Provider/firebase";
import { v4 as uuidv4 } from "uuid";
import Compress from "compress.js";

const AddMember = () => {
  const history = useHistory();
  const [{ member, uid, nodeId, fbKey }, dispatch] = useStateValue();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [address, setAddress] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState();
  const [phNumber, setPhNumber] = useState("");
  const [email, setEmail] = useState("");
  const [job, setJob] = useState("");
  const [gender, setGender] = useState(
    member === "Father"
      ? "M"
      : member === "Mother"
      ? "F"
      : member === "Brother"
      ? "M"
      : member === "Sister"
      ? "F"
      : ""
  );
  const [fbImageUrl, setFbImageUrl] = useState();
  const [memberId, setMemberId] = useState(uuidv4());
  const [rels, setRels] = useState();
  const [children, setChildren] = useState();

  useEffect(() => {
    fbKey &&
      dbServices
        .readDB()
        .child(fbKey)
        .child("rels")
        .on("value", (snapshot) => {
          const relations = snapshot.val();
          setRels(relations);
        });
    setMemberId(uuidv4());
  }, []);

  useEffect(() => {
    if (!rels && member !== ("Brother" || "Sister")) return;
    if ((rels && member === "Brother") || (rels && member === "Sister")) {
      db.ref("relatives")
        .orderByChild("id")
        .equalTo(rels.father)
        .once("value", (snapshot) => {
          let newChildrens;
          let datas = snapshot.val();
          for (let data in datas) {
            const oldChildren = datas[data].rels.children;
            newChildrens = oldChildren;
            newChildrens.push(memberId);
          }
          setChildren(newChildrens);
        });
    }
    return null;
  }, [member, rels]);

  const manageRelation = () => {
    if (member === "Brother" || member === "Sister") {
      if (rels && "father" in rels) {
        if ("mother" in rels) {
          dbServices.updateRel(rels.father, {
            title: "children",
            value: children,
          });
          return {
            father: `${rels.father}`,
            mother: `${rels.mother}`,
          };
        } else {
          alert("Add Mother First");
        }
      } else {
        alert("Add Father First");
      }
    }

    if (member === "Spouses") {
      if (rels && "spouses" in rels) {
        dbServices.updateRel(uid, {
          title: "spouses",
          value: [...rels?.spouses, memberId],
        });
        return {
          spouses: [`${nodeId}`],
        };
      } else {
        return { spouses: [`${nodeId}`] };
      }
    }

    if (member === "Father") {
      if (rels && "mother" in rels) {
        dbServices.updateRel(rels.mother, {
          title: "spouses",
          value: [memberId],
        });
        return {
          spouses: [`${rels.mother}`],
          children: [`${nodeId}`],
        };
      } else {
        return { children: [`${nodeId}`] };
      }
    }
    if (member === "Mother") {
      if (rels && "father" in rels) {
        dbServices.updateRel(rels.father, {
          title: "spouses",
          value: [memberId],
        });
        return {
          spouses: [`${rels.father}`],
          children: [`${nodeId}`],
        };
      } else {
        return { children: [`${nodeId}`] };
      }
    }

    if (member === "Children") {
      return { father: `${nodeId}`, mother: `${rels.spouses[0]}` };
    }
  };

  const saveMember = (url = null) => {
    const newMember = {
      id: memberId,
      uid: "",
      rels: manageRelation(),
      data: {
        birthday: dob.split("-")[2],
        gender: gender,
        firstName: fname,
        lastName: lname,
        birthDate: dob,
        image: url,
        birthPlace: country,
        phoneNumber: phNumber,
        email: email,
        jobDetails: job,
        address: `${address}-${houseNo}-${state}-${country}`,
      },
    };

    const convertArray = () => {
      if (member === "Father" || member === "Mother") {
        return memberId;
      } else {
        return [memberId];
      }
    };
    const updateUserRelation = {
      title: member,
      value: convertArray(),
    };

    dbServices.addDB(newMember);
    if (member != "Spouses" || member != "Brother")
      dbServices.updateRel(uid, updateUserRelation);
    history.push("/");
  };

  const getImageUrl = (url) => {
    if (!url) return;
    saveMember(url);
  };

  const savePicture = (fbUrl) => {
    storageServices.add(memberId, fbUrl, getImageUrl);
  };

  const handleFromSubmit = (e) => {
    e.preventDefault();
    if (fbImageUrl) {
      savePicture(fbImageUrl);
    } else {
      saveMember();
    }
  };
  const onFileChange = async (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size > 30000) {
        const compress = new Compress();
        const file = e.target.files[0];
        const resizedImage = await compress.compress([file], {
          size: 0.03, // the max size in MB, defaults to 2MB
          quality: 1, // the quality of the image, max is 1,
          maxWidth: 700, // the max width of the output image, defaults to 1920px
          maxHeight: 700, // the max height of the output image, defaults to 1920px
          resize: true, // defaults to true, set false if you do not want to resize the image width and height
        });
        const img = resizedImage[0];
        const base64str = img.data;
        const imgExt = img.ext;
        const resizedFile = Compress.convertBase64ToFile(base64str, imgExt);
        setFbImageUrl(resizedFile);
      } else {
        setFbImageUrl(e.target.files[0]);
      }
    }
  };

  const handleDisableButton = () => {
    if (!fname || !lname || !address || !state || !dob) {
      return "disabled";
    }
  };

  return (
    <form className="ui form">
      <h4 className="ui dividing header"> ADD {member.toUpperCase()}</h4>
      <div className="required field">
        <label>Name</label>
        <div className="two fields">
          <div className="field">
            <input
              type="text"
              name="firstname"
              onChange={(e) => setFname(e.target.value)}
              placeholder="First Name"
            />
          </div>
          <div className="field">
            <input
              type="text"
              name="lastname"
              onChange={(e) => setLname(e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </div>
      </div>
      <div className="required field">
        <label>Address</label>
        <div className="fields">
          <div className="twelve wide field">
            <input
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              name="address"
              placeholder="Street Address"
            />
          </div>
          <div className="four wide field">
            <input
              onChange={(e) => setHouseNo(e.target.value)}
              type="text"
              name="houseNo"
              placeholder="House No"
            />
          </div>
        </div>
      </div>
      <div className="two fields">
        <div className="required field">
          <label>State</label>
          <select
            onChange={(e) => setState(e.target.value)}
            value={state}
            className="ui fluid dropdown"
          >
            <option value="">Select State</option>
            <option value="Arun Kshetra">1. Arun Kshetra</option>
            <option value="Janakpur Kshetra">2. Janakpur Kshetra</option>
            <option value="Kathmandu Kshetra">3. Kathmandu Kshetra</option>
            <option value="Gandak Kshetra">4. Gandak Kshetra</option>
            <option value="Kapilavastu Kshetra">5. Kapilavastu Kshetra</option>
            <option value="Karnali Kshetra">6. Karnali Kshetra</option>
            <option value="Mahakali Kshetra">7. Mahakali Kshetra</option>
          </select>
        </div>
        <div className="field">
          <label>Country</label>
          <div className="fields">
            <div className="sixteen wide field">
              <input
                onChange={(e) => setCountry(e.target.value)}
                type="text"
                name="country"
                placeholder="Nepal"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="four fields">
        <div className="required field">
          <label>Gender</label>
          <select
            className="ui fluid dropdown"
            disabled={
              member === "Spouses" ? false : member == "Children" ? false : true
            }
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div className="required field">
          <label>Date of Birth</label>
          <div className="fields">
            <div className="sixteen wide field">
              <input
                onChange={(e) => setDob(e.target.value)}
                type="date"
                name="dob"
                required
                pattern="\d{2}-\d{2}-\d{4}"
              />
            </div>
          </div>
        </div>
        <div className="field">
          <label>Phone Number</label>
          <div className="fields">
            <div className="sixteen wide field">
              <input
                onChange={(e) => setPhNumber(e.target.value)}
                type="number"
                name="phoneNumber"
                placeholder="984-"
              />
            </div>
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <div className="fields">
            <div className="sixteen wide field">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                placeholder="abc@gmail.com"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="field">
        <label>Job Details</label>
        <textarea onChange={(e) => setJob(e.target.value)} rows="2"></textarea>
      </div>

      <div className="two fields">
        <div className="field">
          <div className="ui fluid ">
            <input
              onChange={onFileChange}
              type="file"
              className="inputfile"
              id="embedpollfileinput"
            />
            <label
              htmlFor="embedpollfileinput"
              className="ui huge green right floated button"
            >
              <i className="ui upload icon"></i>
              Upload image
            </label>
          </div>
        </div>

        <div
          onClick={handleFromSubmit}
          typeof="submit"
          className={`field ${handleDisableButton()}`}
        >
          <div className="fields">
            <div
              className="ui huge blue right floated button disable"
              tabIndex="0"
            >
              Save
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddMember;
