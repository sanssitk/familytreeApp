import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useStateValue } from "../StateManagement/StateProvider";
import { dbServices, storageServices } from "../Services/firebaseServices";
import UploadFile from "../Components/FileUploader/UploadFile";
import { v4 as uuidv4 } from "uuid";

const AddMember = () => {
  const history = useHistory();
  const [{ member, uid, nodeId, user }, dispatch] = useStateValue();
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
  // const [children, setChildren] = useState();

  useEffect(() => {
    const callback = (relations) => {
      setRels(relations.rels);
    };
    nodeId && dbServices.readDB(uid, callback);
    setMemberId(uuidv4());
  }, []);

  // useEffect(() => {
  //   if (!rels && member !== ("Brother" || "Sister")) return;
  //   if ((rels && member === "Brother") || (rels && member === "Sister")) {
  //     db.ref("relatives")
  //       .orderByChild("id")
  //       .equalTo(rels.father)
  //       .once("value", (snapshot) => {
  //         let newChildrens;
  //         let datas = snapshot.val();
  //         for (let data in datas) {
  //           const oldChildren = datas[data].rels.children;
  //           newChildrens = oldChildren;
  //           newChildrens.push(memberId);
  //         }
  //         setChildren(newChildrens);
  //       });
  //   }
  //   return null;
  // }, [member, rels]);

  const manageRelation = () => {
    if (member === "Brother" || member === "Sister") {
      if (rels && "father" in rels) {
        if ("mother" in rels) {
          dbServices.updateRel(rels.father, {
            title: "children",
            value: [memberId],
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
          value: [memberId],
        });
        return {
          spouses: [`${nodeId}`],
        };
      } else {
        dbServices.updateRel(uid, {
          title: "spouses",
          value: [memberId],
        });
        return { spouses: [`${nodeId}`] };
      }
    }

    if (member === "Father") {
      if (rels && "mother" in rels) {
        dbServices.updateRel(rels.mother, {
          title: ["spouses", "parents"],
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
          title: ["spouses", "parents"],
          value: [memberId],
        });
        dbServices.updateRel(uid, {
          title: "mother",
          value: memberId,
        });
        return {
          spouses: [`${rels.father}`],
        };
      } else {
        alert("Add father first");
        // return { children: [`${nodeId}`] };
      }
    }

    if (member === "Children") {
      if (rels.spouses && nodeId) {
        dbServices.updateRel(uid, {
          title: "children",
          value: [memberId],
        });
        return { father: `${nodeId}`, mother: `${rels.spouses[0]}` };
      } else {
        alert("add wife first");
      }
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
        image: url ? url : "",
        birthPlace: country,
        phoneNumber: phNumber,
        email: email,
        jobDetails: job,
        address: `${address}-${houseNo}-${state}-${country}`,
      },
    };

    dbServices.addDB(newMember);
    history.push(`/home/${user.displayName.split(" ")[0]}=${user.uid}`);
  };

  const getImageUrl = (url) => {
    try {
      saveMember(url);
    } catch {
      alert("Image cannot be uploaded at this time..");
      saveMember();
    }
  };

  const savePicture = (fbUrl) => {
    setFbImageUrl(fbUrl);
  };

  const handleFromSubmit = (e) => {
    e.preventDefault();
    if (fbImageUrl) {
      storageServices.add(memberId, fbImageUrl, getImageUrl);
    } else {
      saveMember();
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
            <UploadFile callback={savePicture} />
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
