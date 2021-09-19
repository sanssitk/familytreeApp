import React from "react";
import "./forms.css";
import { useStateValue } from "../../StateManagement/StateProvider";

const LoginUserForm = () => {
  const [{ nodeId, user, uid }, dispatch] = useStateValue();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

  return (
    <form className="ui form" onSubmit={handleSubmit}>
      <h4 className="ui dividing header"> INFORMATION</h4>
      <div className="required field">
        <label>Name</label>
        <div className="two fields">
          <div className="field">
            <input
              type="text"
              name="firstname"
              placeholder={user?.displayName.split(" ")[0]}
            />
          </div>
          <div className="field">
            <input
              type="text"
              name="lastname"
              placeholder={user?.displayName.split(" ")[1]}
            />
          </div>
        </div>
      </div>
      <div className="field">
        <label>Address</label>
        <div className="fields">
          <div className="twelve wide field">
            <input type="text" name="address" placeholder="Street Address" />
          </div>
          <div className="four wide field">
            <input type="text" name="houseNo" placeholder="House No" />
          </div>
        </div>
      </div>
      <div className="two fields">
        <div className="field">
          <label>State</label>
          <select value="1" className="ui fluid dropdown">
            <option value="1">1. Arun Kshetra</option>
            <option value="2">2. Janakpur Kshetra</option>
            <option value="3">3. Kathmandu Kshetra</option>
            <option value="4">4. Gandak Kshetra</option>
            <option value="5">5. Kapilavastu Kshetra</option>
            <option value="6">6. Karnali Kshetra</option>
            <option value="7">7. Mahakali Kshetra</option>
          </select>
        </div>
        <div className="field">
          <label>Country</label>
          <div className="fields">
            <div className="sixteen wide field">
              <input type="text" name="country" placeholder="Nepal" />
            </div>
          </div>
        </div>
      </div>

      <div className="four fields">
        <div className="field">
          <label>Gender</label>
          <select value="M" className="ui fluid dropdown">
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div className="field">
          <label>Date of Birth</label>
          <div className="fields">
            <div className="sixteen wide field">
              <input value="date" type="date" name="shipping[address]" />
            </div>
          </div>
        </div>
        <div className="field">
          <label>Phone Number</label>
          <div className="fields">
            <div className="sixteen wide field">
              <input type="number" name="phoneNumber" placeholder="984-" />
            </div>
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <div className="fields">
            <div className="sixteen wide field">
              <input type="email" name="email" placeholder="abc@gmail.com" />
            </div>
          </div>
        </div>
      </div>

      <div className="field">
        <label>Job Details</label>
        <textarea value="jobText" rows="2"></textarea>
      </div>

      <div className="two fields">
        <div className="field">
          <div className="ui fluid ">
            <input type="file" className="inputfile" id="embedpollfileinput" />
            <label
              htmlFor="embedpollfileinput"
              className="ui huge green right floated button"
            >
              <i className="ui upload icon"></i>
              Upload image
            </label>
          </div>
        </div>

        <div className="field">
          <div className="fields">
            <div className="ui huge blue right floated button" tabIndex="0">
              Save
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginUserForm;
