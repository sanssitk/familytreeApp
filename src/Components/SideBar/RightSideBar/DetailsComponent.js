import React, { useState } from "react";

const DetailsComponent = ({ title, text, toggleDisable, handleChange }) => {
  const [value, setValue] = useState(text);

  return (
    <div className="ui large userMoreInfo">
      <div className="detailTitle">
        {title.charAt(0).toUpperCase() + title.slice(1)}:
      </div>
      <div
        className={`ui fluid input detailtext ${
          toggleDisable ? "disabled transparent" : ""
        }`}
      >
        <input
          title={`${title}`}
          onChange={(e) => {
            setValue(e.target.value);
            handleChange(e);
          }}
          type="text"
          value={value}
          placeholder={value}
          disabled={
            title === "birthDate"
              ? true
              : false || title === "birthPlace"
              ? true
              : false
          }
        />        
      </div>
    </div>
  );
};

export default DetailsComponent;
