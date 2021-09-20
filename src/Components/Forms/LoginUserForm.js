import React, { useState } from "react";
import "./forms.css";
import { useStateValue } from "../../StateManagement/StateProvider";
import { storage } from "../../Provider/firebase";
import { v4 as uuidv4 } from "uuid";
import db from "../../Provider/firebase";

const LoginUserForm = (userUid) => {
  const [{ nodeId, user, uid }, dispatch] = useStateValue();

  const [fname, setFname] = useState(user?.displayName.split(" ")[0]);
  const [lname, setLname] = useState(user?.displayName.split(" ")[0]);
  const [address, setAddress] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [state, setState] = useState();
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState();
  const [dob, setDob] = useState();
  const [phNumber, setPhNumber] = useState("");
  const [email, setEmail] = useState("");
  const [job, setJob] = useState("");
  const [fbImageUrl, setFbImageUrl] = useState();

  if (userUid)
    return (
      <div
        style={{
          height: "100vh",
          color: "white",
          textAlign: "center",
          margin: "auto auto",
        }}
      >
        <h1>You already have data added</h1>
      </div>
    );

  const handleFromSubmit = (e) => {
    e.preventDefault();
    const member = {
      id: uuidv4(),
      uid: uid,
      rels: {
        father: "",
        mother: "",
      },
      data: {
        "first name": "Name",
        "last name": "Surname",
        birthday: dob.split("-")[2],
        gender: gender,
        firstName: fname,
        lastName: lname,
        birthDate: dob,
        image: `${fbImageUrl ? fbImageUrl : user?.photoURL}`,
        deathDate: "",
        birthPlace: country,
        deathPlace: "Unknown",
        phoneNumber: phNumber,
        email: email,
        jobDetails: job,
        address: `${address}-${houseNo}-${state}-${country}`,
      },
    };
    db.ref("relatives").push(member);
  };

  const uploadPicture = (fbUrl) => {
    const uploadTask = storage.ref(`images/${uid}.jpg`).put(fbUrl);
    uploadTask.on(
      "stage_changed",
      (snapshot) => {},
      (err) => console.log(err),
      () => {
        storage
          .ref("images")
          .child(`${uid}.jpg`)
          .getDownloadURL()
          .then((url) => setFbImageUrl(url));
      }
    );
  };

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      // setSelectedFile(e.target.files[0]);
      uploadPicture(e.target.files[0]);
    }
  };

  const handleDisableButton = () => {
    if (!fname || !lname || !address || !state || !gender || !dob) {
      return "disabled";
    }
  };

  return (
    <form className="ui form">
      <h4 className="ui dividing header"> INFORMATION</h4>
      <div className="required field">
        <label>Name</label>
        <div className="two fields">
          <div className="field">
            <input
              type="text"
              name="firstname"
              onChange={(e) => setFname(e.target.value)}
              placeholder={user?.displayName.split(" ")[0]}
            />
          </div>
          <div className="field">
            <input
              type="text"
              name="lastname"
              onChange={(e) => setLname(e.target.value)}
              placeholder={user?.displayName.split(" ")[1]}
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
            onChange={(e) => setGender(e.target.value)}
            value={gender}
            className="ui fluid dropdown"
          >
            <option value="">Select Gender</option>
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

export default LoginUserForm;
